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
provider "aws" {
  alias                    = "root"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "${var.root_account_name}${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.root_account_id]
}

provider "aws" {
  alias                    = "infrastructure"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "infrastructure${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.infrastructure_account_id]
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
  alias                    = "development"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "development${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.development_account_id]
}

provider "aws" {
  alias                    = "production"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile                  = "production${var.profile_suffix}"
  region                   = "us-east-1"
  allowed_account_ids      = [var.production_account_id]
}
variable "root_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "infrastructure_account_id" {
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

variable "development_account_id" {
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

variable "image_tag" {
  description = "The tag for the docker images"
  type        = string
}

variable "manifest_file" {
  description = "The manifest file"
  type        = string
}

variable "dist_dir" {
  description = "The manifest directory"
  type        = string
}

module "tf_state_bootstrap" {
  providers = {
    aws.root = aws.root
  }
  source            = "../modules/tf_state_bootstrap"
  root_account_id   = var.root_account_id
  root_account_name = var.root_account_name
}

module "organization" {
  providers = {
    aws.root = aws.root
  }
  source = "./organization"
}

module "infrastructure" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.infrastructure
  }
  source                    = "./infra_account"
  account_email             = "jon+infrastructure@zudell.io"
  bucket_infix              = "infrastructure"
  account_name              = "InfrastructureAccount"
  root_account_id           = var.root_account_id
  development_account_id    = var.development_account_id
  production_account_id     = var.production_account_id
  infrastructure_account_id = var.infrastructure_account_id
  manifest_file             = var.manifest_file
  cloudfront_distribution = module.development.cloudfront_distribution
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
  root_account_id           = var.root_account_id
  infrastructure_profile    = "infrastructure${var.profile_suffix}"
  infrastructure_account_id = var.infrastructure_account_id
  repositories              = module.infrastructure.repositories
  dist_dir                  = var.dist_dir
  manifest_file             = var.manifest_file
  image_tag                 = var.image_tag
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
  dist_dir        = var.dist_dir
}

output "terraform_state_bucket" {
  value = module.tf_state_bootstrap.terraform_state_bucket
}

output "terraform_locks_table" {
  value = module.tf_state_bootstrap.terraform_dynamodb_locks
}

output "development_s3_website_url" {
  value = module.development.s3_website_url
}

output "production_s3_website_url" {
  value = module.production.s3_website_url
}
output "development_api_url" {
  value = module.development.api_url
}
output "development_cloudfront_url" {
  description = "The URL of the CloudFront distribution"
  value       = module.development.cloudfront_url
}
output "infrastructure_name_servers" {
  description = "The name servers from the infrastructure module"
  value       = module.infrastructure.name_servers
}