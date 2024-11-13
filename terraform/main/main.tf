terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.75.1"
    }
  }
  backend "s3" {
    encrypt        = true
    bucket         = "zudellio-state-infrastructure"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}
variable "root_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "monitoring_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "security_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "production_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "root_account_name" {
  description = "AWS Account Name"
  type        = string
}

variable "profile_suffix" {
  description = "AWS Configuration Profile"
  type        = string
}

provider "aws" {
  alias                    = "root"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "${var.root_account_name}${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.root_account_id]
}

provider "aws" {
  alias                    = "monitoring"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "monitoring${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.monitoring_account_id]
}

provider "aws" {
  alias                    = "security"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "security${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.security_account_id]
}


provider "aws" {
  alias                    = "production"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "production${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.production_account_id]
}

module "tf_state_bootstrap" {
  providers = {
    aws.root = aws.root
  }
  source            = "./modules/tf_state_bootstrap"
  root_account_id   = var.root_account_id
  root_account_name = var.root_account_name
}

module "organization" {
  providers = {
    aws.root       = aws.root
    aws.monitoring = aws.monitoring
    aws.security   = aws.security
    aws.production = aws.production
  }
  source          = "./modules/organization"
  root_account_id = var.root_account_id
}

output "terraform_state_bucket" {
  value = module.tf_state_bootstrap.terraform_state_bucket
}

output "terraform_locks_table" {
  value = module.tf_state_bootstrap.terraform_dynamodb_locks
}

output "s3_website_url" {
  value = module.organization.s3_website_url
}