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

variable "commit_hash" {
  type = string
}

variable "manifests_dir" {
  type = string
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

resource "aws_s3_bucket_public_access_block" "static_website_public_access_block" {
  provider = aws.target
  bucket   = aws_s3_bucket.static_website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_iam_role" "lambda_exec" {
  provider = aws.target
  name     = "zudellio_lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}
resource "aws_iam_role_policy_attachment" "lambda_exec_policy" {
  provider   = aws.target
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role_policy" "ecr_read_policy" {
  name     = "ecr_read_policy"
  role     = aws_iam_role.lambda_exec.id
  provider = aws.target
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = "*"
      }
    ]
  })
}

module "interface_upload" {
  providers = {
    aws.target = aws.target
  }
  source        = "../../../modules/interface_upload"
  interface_dir = "${abspath(path.module)}/../../../../interface"
  bucket        = aws_s3_bucket.static_website
  environment   = var.environment
}

module "lambda" {
  providers = {
    aws.target = aws.target
  }
  source                 = "../../../modules/lambda"
  for_each               = var.repositories
  repository             = each.value
  lambda_name            = each.key
  infrastructure_profile = var.infrastructure_profile
  commit_hash            = var.commit_hash
  lambda_exec            = aws_iam_role.lambda_exec
  manifests_dir          = var.manifests_dir
}

output "s3_website_url" {
  description = "The URL of the S3 static website"
  value       = module.interface_upload.s3_website_url
}