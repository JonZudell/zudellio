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

# resource "aws_iam_role_policy_attachment" "basic_lambda_execution" {
#   provider   = aws.target
#   role       = aws_iam_role.lambda_execution_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }
# resource "aws_iam_role" "lambda_execution_role" {
#   provider           = aws.target
#   name               = "lambda_execution_role"
#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "Service": "lambda.amazonaws.com"
#       }
#     }
#   ]
# }
# EOF
# }
# resource "aws_iam_role_policy_attachment" "lambda_logging" {
#   provider   = aws.target
#   role       = aws_iam_role.lambda_execution_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  provider   = aws.target
  name       = "/aws/lambda/${var.account_name}"
  retention_in_days = 14
}
# resource "aws_iam_policy" "lambda_execution_policy" {
#   provider = aws.target
#   name     = "lambda_execution_policy"
#   policy   = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": [
#         "sts:AssumeRole",
#         "ecr:GetDownloadUrlForLayer",
#         "ecr:BatchGetImage",
#         "ecr:BatchCheckLayerAvailability"
#       ],
#       "Resource": [
#         "arn:aws:iam::${var.infrastructure_account_id}:role/cross_account_ecr_read_role",
#         "arn:aws:ecr:us-east-1:${var.infrastructure_account_id}:repository/*"
#       ]
#     }
#   ]
# }
# EOF
# }

# resource "aws_iam_policy_attachment" "lambda_execution_policy_attachment" {
#   name       = "lambda_execution_policy_attachment"
#   provider   = aws.target
#   roles      = [aws_iam_role.lambda_execution_role.name]
#   policy_arn = aws_iam_policy.lambda_execution_policy.arn
# }

module "interface" {
  providers = {
    aws.target = aws.target
  } 
  source       = "../../modules/interface_0"
  dist_dir     = var.dist_dir
  bucket_infix = var.bucket_infix
  environment  = var.environment
  api_gateway = module.api_gateway.api_gateway
  api_gateway_role = module.api_gateway.api_gateway_role
}

module "api_gateway" {
  providers = {
    aws.target = aws.target
  }
  source = "../../modules/api_gateway"
  bucket = module.interface.s3_bucket
}

# module "lambda" {
#   providers = {
#     aws.target = aws.target
#   }
#   source                    = "../../modules/lambda"
#   for_each                  = var.repositories
#   repository                = each.value
#   lambda_name               = each.key
#   infrastructure_profile    = var.infrastructure_profile
#   infrastructure_account_id = var.infrastructure_account_id
#   execution_role            = aws_iam_role.lambda_execution_role
#   manifest_file             = var.manifest_file
#   image_tag                 = var.image_tag
# }
output "s3_website_url" {
  description = "The URL of the S3 static website"
  value       = module.interface.s3_website_url
}
output "api_url" {
  value = module.api_gateway.api_url
}