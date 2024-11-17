terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.root,
        aws.infrastructure,
        aws.monitoring,
        aws.security,
        aws.development,
        aws.production,
      ]
    }
  }
}

variable "root_account_id" {
  description = "The account number of the root account"
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

variable "manifests_dir" {
  description = "The directory containing manifests"
}

variable "infrastructure_profile" {
  type = string
}

variable "commit_hash" {
  type = string
}

resource "aws_organizations_organization" "org" {
  aws_service_access_principals = ["sso.amazonaws.com", "cloudtrail.amazonaws.com", "config.amazonaws.com"]
  feature_set                   = "ALL"
}

module "infrastructure" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.infrastructure
  }
  source                 = "./infra_account"
  account_email          = "jon+infrastructure@zudell.io"
  bucket_infix           = "infrastructure"
  account_name           = "InfrastructureAccount"
  manifests_dir          = var.manifests_dir
  root_account_id        = var.root_account_id
  development_account_id = var.development_account_id
  production_account_id  = var.production_account_id
}

module "monitoring" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.monitoring
  }
  source          = "./nonroot_account"
  account_email   = "jon+monitoring@zudell.io"
  account_name    = "MonitoringAccount"
  root_account_id = var.root_account_id

}

module "security" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.security
  }
  source          = "./nonroot_account"
  account_email   = "jon+security@zudell.io"
  account_name    = "SecurityAccount"
  root_account_id = var.root_account_id
}

module "development" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.development
  }
  source                    = "./stage_account_0"
  account_email             = "jon+development@zudell.io"
  bucket_infix              = "development"
  account_name              = "DevelopmentAccount"
  environment               = "development"
  lambda_repo_policy        = module.infrastructure
  root_account_id           = var.root_account_id
  infrastructure_account_id = var.infrastructure_account_id
  infrastructure_profile    = var.infrastructure_profile
  commit_hash               = var.commit_hash
  repositories              = module.infrastructure.repositories
  manifests_dir             = var.manifests_dir
}
module "production" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.production
  }
  source          = "./stage_account"
  account_email   = "jon+production@zudell.io"
  bucket_infix    = "production"
  environment     = "production"
  account_name    = "ProductionAccount"
  root_account_id = var.root_account_id
}

output "development_s3_website_url" {
  value = module.development.s3_website_url
}

output "production_s3_website_url" {
  value = module.production.s3_website_url
}

output "repositories" {
  value = module.infrastructure.repositories
}