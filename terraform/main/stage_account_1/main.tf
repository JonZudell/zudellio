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

variable "log_key" {
  description = "The key to encrypt the logs"
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

variable "manifest_dir" {
  description = "The manifest file containing all framework resources"
}

variable "image_tag" {
  description = "The tag for the docker images"
  type        = string
}
variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
}

variable "subnet_cidr_block" {
  description = "The CIDR block for the subnet"
  type        = string
}
resource "aws_organizations_account" "account" {
  provider = aws.root
  name     = var.account_name
  email    = var.account_email
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  provider          = aws.target
  name              = "/aws/lambda/${var.account_name}"
  retention_in_days = 365
}

module "interface" {
  providers = {
    aws.target = aws.target
  }
  source       = "../../modules/interface_1"
  dist_dir     = var.dist_dir
  bucket_infix = var.bucket_infix
  tag          = var.image_tag
}

module "api_gateway" {
  providers = {
    aws.target = aws.target
  }
  source                    = "../../modules/api_gateway"
  log_key                   = var.log_key
  infrastructure_account_id = var.infrastructure_account_id
  manifest_file             = "${var.manifest_dir}/${var.image_tag}_lambdas.json"
  lambdas                   = module.lambdas.lambdas
}

module "vpc" {
  providers = {
    aws.target = aws.target
  }
  source            = "../../modules/vpc"
  vpc_cidr_block    = var.vpc_cidr_block
  subnet_cidr_block = var.subnet_cidr_block
}

module "lambdas" {
  providers = {
    aws.target = aws.target
  }
  source                    = "../../modules/lambdas"
  repositories              = var.repositories
  image_tag                 = var.image_tag
  infrastructure_account_id = var.infrastructure_account_id
  lambda_log_key            = var.log_key
  subnet_ids                = [module.vpc.subnet.id]
  security_group_ids        = [module.vpc.security_group.id]
}

module "persistence" {
  providers = {
    aws.target = aws.target
  }
  source                    = "../../modules/persistence"
  persistence_manifest_file = "${var.manifest_dir}/${var.image_tag}_dynamodb.json"
}

output "static_website_bucket" {
  value = module.interface.static_website_bucket
}