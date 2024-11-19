terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.root,
        aws.target,
      ]
    }
  }
}

variable "account_name" {
  description = "The name of the AWS account"
  type        = string
}

variable "root_account_id" {
  description = "The ID of the root AWS account"
  type        = string
}

variable "account_email" {
  description = "The email address of the account"
  type        = string
}

variable "bucket_infix" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "environment" {
  description = "The environment to deploy to"
  type        = string
}

variable "repositories" {
  description = "List of repositories the be deployed to lambdas"
}

variable "infrastructure_profile" {
  type = string
}
variable "infrastructure_account_id" {
  type = string
}

variable "dist_dir" {
  description = "the distribution directory"
}
variable "manifest_file" {
  description = "The directory containing manifests"
}

variable "image_tag" {
  description = "The tag for the docker images"
  type        = string
}

resource "aws_organizations_account" "account" {
  provider = aws.root
  name     = var.account_name
  email    = var.account_email
}

resource "aws_iam_role" "AdminAccessSSOFromRoot" {
  provider = aws.target
  name     = "AdminAccessSSOFromRoot"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${var.root_account_id}:root"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}
resource "random_id" "static_website" {
  byte_length = 8
}

resource "aws_s3_bucket" "static_website" {
  provider = aws.target
  bucket   = "zudellio-${var.bucket_infix}-static-website-${random_id.static_website.hex}"
}
resource "aws_s3_bucket_policy" "static_website_policy" {
  provider = aws.target
  bucket = aws_s3_bucket.static_website.bucket
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "${module.api_gateway.api_gateway_role.arn}"
        }
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.static_website.arn}/*"
      }
    ]
  })
}
resource "aws_s3_bucket_ownership_controls" "static_website_ownership_controls" {
  provider = aws.target
  bucket   = aws_s3_bucket.static_website.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "static_website_acl" {
  provider = aws.target
  depends_on = [
    aws_s3_bucket_ownership_controls.static_website_ownership_controls,
    aws_s3_bucket.static_website,
    aws_s3_bucket_public_access_block.static_website_public_access_block
  ]
  bucket = aws_s3_bucket.static_website.id
  acl    = "public-read"

}
resource "aws_s3_bucket_cors_configuration" "static_website_cors" {
  provider = aws.target
  bucket = aws_s3_bucket.static_website.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
  }
}
resource "aws_s3_bucket_public_access_block" "static_website_public_access_block" {
  provider = aws.target
  bucket   = aws_s3_bucket.static_website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_iam_role_policy_attachment" "basic_lambda_execution" {
  provider   = aws.target
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role" "lambda_execution_role" {
  provider           = aws.target
  name               = "lambda_execution_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }
  ]
}
EOF
}
resource "aws_iam_role_policy_attachment" "lambda_logging" {
  provider   = aws.target
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  provider   = aws.target
  name       = "/aws/lambda/${var.account_name}"
  retention_in_days = 14
}
resource "aws_iam_policy" "lambda_execution_policy" {
  provider = aws.target
  name     = "lambda_execution_policy"
  policy   = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sts:AssumeRole",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ],
      "Resource": [
        "arn:aws:iam::${var.infrastructure_account_id}:role/cross_account_ecr_read_role",
        "arn:aws:ecr:us-east-1:${var.infrastructure_account_id}:repository/*"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "lambda_execution_policy_attachment" {
  name       = "lambda_execution_policy_attachment"
  provider   = aws.target
  roles      = [aws_iam_role.lambda_execution_role.name]
  policy_arn = aws_iam_policy.lambda_execution_policy.arn
}
module "interface" {
  providers = {
    aws.target = aws.target
  }
  source      = "../../modules/interface"
  dist_dir    = var.dist_dir
  bucket      = aws_s3_bucket.static_website
  environment = var.environment
}
module "api_gateway" {
  providers = {
    aws.target = aws.target
  }
  source = "../../modules/api_gateway"
  bucket = aws_s3_bucket.static_website
}
module "lambda" {
  providers = {
    aws.target = aws.target
  }
  source                    = "../../modules/lambda"
  for_each                  = var.repositories
  repository                = each.value
  lambda_name               = each.key
  infrastructure_profile    = var.infrastructure_profile
  infrastructure_account_id = var.infrastructure_account_id
  execution_role            = aws_iam_role.lambda_execution_role
  manifest_file             = var.manifest_file
  image_tag                 = var.image_tag
}
output "s3_website_url" {
  description = "The URL of the S3 static website"
  value       = module.interface.s3_website_url
}
output "api_url" {
  value = module.api_gateway.api_url
}