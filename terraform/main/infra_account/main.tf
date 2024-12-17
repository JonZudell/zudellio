terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.root,
        aws.development,
        aws.production,
        aws.target,
      ]
    }
  }
}

variable "c2_username" {}
variable "c2_password" {}
variable "c2_license" {}
variable "c2_image" {}

variable "account_email" {
  description = "The email address of the account"
  type        = string
}

variable "account_name" {
  description = "The name of the account"
  type        = string
}

variable "bucket_infix" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "development_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "development_interface_bucket" {
  description = "The S3 bucket for the development interface"
}

variable "production_interface_bucket" {
  description = "The S3 bucket for the development interface"
}

variable "infrastructure_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "manifest_dir" {
  description = "The manifest"
}
variable "tag" {

}

variable "org_id" {}

variable "production_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "root_account_id" {
  description = "The AWS account ID of the root account"
  type        = string
}

resource "aws_organizations_account" "account" {
  provider = aws.root
  name     = var.account_name
  email    = var.account_email
}
resource "aws_iam_policy" "ecr_policy" {
  provider = aws.target
  name     = "ECRPolicy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_policy_attachment" {
  provider   = aws.target
  role       = aws_iam_role.AdminAccessSSOFromRoot.name
  policy_arn = aws_iam_policy.ecr_policy.arn
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

resource "aws_iam_policy" "admin_policy" {
  provider = aws.target
  name     = "AdminPolicy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "secretsmanager:*",
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = "iam:*",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "admin_policy_attachment" {
  provider   = aws.target
  role       = aws_iam_role.AdminAccessSSOFromRoot.name
  policy_arn = aws_iam_policy.admin_policy.arn
}

module "ecr" {
  source = "../../modules/ecr"
  providers = {
    aws.target = aws.target
  }
  manifest_prefix           = "${var.manifest_dir}/${var.tag}"
  root_account_id           = var.root_account_id
  infrastructure_account_id = var.infrastructure_account_id
  development_account_id    = var.development_account_id
  production_account_id     = var.production_account_id
  ecr_key                   = module.kms.ecr_key
  org_id                    = var.org_id
}

module "dns" {
  source = "../../modules/dns"
  providers = {
    aws.target = aws.target
  }
  development_cloudfront_distribution = module.cloudfront.development_cloudfront_distribution
  production_cloudfront_distribution  = module.cloudfront.production_cloudfront_distribution
  development_account_id              = var.development_account_id
  c2_instance_public_ip               = module.c2.c2_instance_public_ip
}

module "cloudfront" {
  providers = {
    aws.target      = aws.target
    aws.development = aws.development
    aws.production  = aws.production
  }
  source                    = "../../modules/cloudfront"
  development_site_bucket   = var.development_interface_bucket
  production_site_bucket    = var.production_interface_bucket
  certificate_arn           = module.dns.cloudfront_distribution_certificate.arn
  infrastructure_account_id = var.infrastructure_account_id
}

module "kms" {
  providers = {
    aws.target = aws.target
  }
  source                    = "../../modules/kms"
  infrastructure_account_id = var.infrastructure_account_id
  development_account_id    = var.development_account_id
}

module "c2" {
  providers = {
    aws.target = aws.target
  }
  c2_image    = var.c2_image
  c2_license  = var.c2_license
  c2_password = var.c2_password
  c2_username = var.c2_username
  source      = "../../modules/c2"
}

output "repositories" {
  value = module.ecr.repositories
}

output "lambda_repo_policy" {
  value = module.ecr.lambda_repo_policy
}

output "name_servers" {
  value = module.dns.name_servers
}

output "development_cloudfront_url" {
  value = module.cloudfront.development_cloudfront_distribution.domain_name
}

output "production_cloudfront_url" {
  value = module.cloudfront.production_cloudfront_distribution.domain_name
}

output "log_key" {
  value = module.kms.log_key
}
