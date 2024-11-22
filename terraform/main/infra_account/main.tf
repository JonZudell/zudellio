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

variable "bucket_infix" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "cloudfront_distribution" {
  description = "The cloudfront distribution id"
}

variable "root_account_id" {
  description = "The AWS account ID of the root account"
  type        = string
}

variable "account_name" {
  description = "The name of the account"
  type        = string
}

variable "account_email" {
  description = "The email address of the account"
  type        = string
}

variable "manifest_file" {
  description = "The manifest"
}

variable "infrastructure_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "development_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "production_account_id" {
  description = "AWS Account Number"
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

module "ecr" {
  source = "../../modules/ecr"
  providers = {
    aws.target = aws.target
  }
  manifest_file             = var.manifest_file
  root_account_id           = var.root_account_id
  infrastructure_account_id = var.infrastructure_account_id
  development_account_id    = var.development_account_id
}

module "dns" {
  source = "../../modules/dns"
  providers = {
    aws.target = aws.target
  }
  cloudfront_distribution = var.cloudfront_distribution
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
output "dns_certificate_arn" {
  value = module.dns.certificate_arn
}