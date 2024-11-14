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

resource "aws_organizations_organization" "org" {
  aws_service_access_principals = ["sso.amazonaws.com", "cloudtrail.amazonaws.com", "config.amazonaws.com"]
  feature_set                   = "ALL"
}

module "infrastructure" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.infrastructure
  }
  source          = "../infra_account"
  account_email    = "jon+infrastructure@zudell.io"
  bucket_infix     = "infrastructure"
  account_name    = "InfrastructureAccount"
  root_account_id = var.root_account_id
}

module "monitoring" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.monitoring
  }
  source          = "../nonroot_account"
  account_email    = "jon+monitoring@zudell.io"
  account_name    = "MonitoringAccount"
  root_account_id = var.root_account_id

}

module "security" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.security
  }
  source          = "../nonroot_account"
  account_email    = "jon+security@zudell.io"
  account_name    = "SecurityAccount"
  root_account_id = var.root_account_id
}

module "development" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.development
  }
  source          = "../stage_account"
  account_email    = "jon+development@zudell.io"
  bucket_infix     = "development"
  account_name    = "DevelopmentAccount"
  root_account_id = var.root_account_id
}

module "production" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.production
  }
  source          = "../stage_account"
  account_email    = "jon+production@zudell.io"
  bucket_infix     = "production"
  account_name    = "ProductionAccount"
  root_account_id = var.root_account_id
}

output "development_s3_website_url" {
  value = module.development.s3_website_url
}

output "production_s3_website_url" {
  value = module.production.s3_website_url
}