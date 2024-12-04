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

variable "manifest_file" {
  description = "The manifest"
}

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

module "log_bucket" {
  providers = {
    aws.target = aws.target
  }
  source        = "../../modules/log_bucket"
  bucket_prefix = "infrastructure"
  log_key       = module.kms.log_key
}

module "ecr" {
  source = "../../modules/ecr"
  providers = {
    aws.target = aws.target
  }
  manifest_file             = var.manifest_file
  root_account_id           = var.root_account_id
  infrastructure_account_id = var.infrastructure_account_id
  development_account_id    = var.development_account_id
  production_account_id     = var.production_account_id
  ecr_key                   = module.kms.ecr_key
}

module "dns" {
  source = "../../modules/dns"
  providers = {
    aws.target = aws.target
  }
  development_cloudfront_distribution = module.cloudfront.development_cloudfront_distribution
  production_cloudfront_distribution  = module.cloudfront.production_cloudfront_distribution
  development_account_id              = var.development_account_id
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
  logging_bucket            = module.log_bucket.log_bucket
  //waf_acl                   = module.waf.waf_acl
}

# module "waf" {
#   providers = {
#     aws.target = aws.target
#   }
#   source = "../../modules/waf"
# }

module "kms" {
  providers = {
    aws.target = aws.target
  }
  source                    = "../../modules/kms"
  infrastructure_account_id = var.infrastructure_account_id
  development_account_id    = var.development_account_id
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