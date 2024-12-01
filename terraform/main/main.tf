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

variable "development_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "dist_dir" {
  description = "The manifest directory"
  type        = string
}

variable "image_tag" {
  description = "The tag for the docker images"
  type        = string
}
variable "production_image_tag" {
  description = "The tag for the docker images"
  type        = string
}
variable "infrastructure_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "manifest_dir" {
  description = "The manifest file"
  type        = string
}

variable "monitoring_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "production_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "profile_suffix" {
  description = "AWS Configuration Profile"
  type        = string
}

variable "root_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "root_account_name" {
  description = "AWS Account Name"
  type        = string
}

variable "security_account_id" {
  description = "AWS Account Number"
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
    aws.root        = aws.root
    aws.target      = aws.infrastructure
    aws.development = aws.development
  }
  source                       = "./infra_account"
  account_email                = "jon+infrastructure@zudell.io"
  bucket_infix                 = "infrastructure"
  account_name                 = "InfrastructureAccount"
  root_account_id              = var.root_account_id
  development_account_id       = var.development_account_id
  production_account_id        = var.production_account_id
  infrastructure_account_id    = var.infrastructure_account_id
  manifest_file                = "${var.manifest_dir}/${var.image_tag}.json"
  development_interface_bucket = module.development.static_website_bucket
  production_interface_bucket  = module.production.static_website_bucket
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
  dist_dir                  = "${var.dist_dir}/${var.image_tag}/"
  manifest_file             = "${var.manifest_dir}/${var.image_tag}.json"
  image_tag                 = var.image_tag
  log_key                   = module.infrastructure.log_key
}

module "production" {
  providers = {
    aws.root   = aws.root
    aws.target = aws.production
  }
  source                    = "./stage_account_0"
  account_email             = "jon+production@zudell.io"
  bucket_infix              = "production"
  environment               = "production"
  account_name              = "ProductionAccount"
  infrastructure_profile    = "infrastructure${var.profile_suffix}"
  infrastructure_account_id = var.infrastructure_account_id
  repositories              = module.infrastructure.repositories
  dist_dir                  = "${var.dist_dir}/${var.production_image_tag}/"
  manifest_file             = "${var.manifest_dir}/${var.production_image_tag}.json"
  image_tag                 = var.production_image_tag
  log_key                   = module.infrastructure.log_key
  root_account_id           = var.root_account_id
}

output "terraform_state_bucket" {
  value = module.tf_state_bootstrap.terraform_state_bucket
}

output "terraform_locks_table" {
  value = module.tf_state_bootstrap.terraform_dynamodb_locks
}

output "development_s3_website_url" {
  value = module.development.static_website_bucket.website_endpoint
}
# output "development_api_url" {
#   value = module.development.api_url
# }
output "development_cloudfront_url" {
  description = "The URL of the CloudFront distribution"
  value       = module.infrastructure.development_cloudfront_url
}
output "production_s3_website_url" {
  value = module.production.static_website_bucket.website_endpoint
}
# output "production_api_url" {
#   value = module.production.api_url
# }
output "production_cloudfront_url" {
  description = "The URL of the CloudFront distribution"
  value       = module.infrastructure.production_cloudfront_url
}
output "infrastructure_name_servers" {
  description = "The name servers from the infrastructure module"
  value       = module.infrastructure.name_servers
}