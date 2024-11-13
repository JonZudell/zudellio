terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "root_account_id" {
  description = "The account number of the root account"
}

resource "aws_organizations_organization" "org" {
  provider                      = aws.root
  aws_service_access_principals = ["sso.amazonaws.com", "cloudtrail.amazonaws.com", "config.amazonaws.com"]
  feature_set                   = "ALL"
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

# module "production" {
#   providers = {
#     aws.root   = aws.root
#     aws.target = aws.production
#   }
#   source          = "../nonroot_account"
#   account_name    = "production"
#   root_account_id = var.root_account_id
# }

module "production" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.production
  }
  source          = "../stage_account"
  account_email    = "jon+production@zudell.io"
  account_name    = "ProductionAccount"
  root_account_id = var.root_account_id
}