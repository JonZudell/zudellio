variable "account_id" {
  description = "The ID of the AWS account"
  type        = string
}

variable "account_name" {
  description = "The name of the AWS account"
  type        = string
}

variable "region" {
  description = "The AWS region"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "The environment for the account (e.g., dev, stage, prod)"
  type        = string
}

module "nonroot_account" {
  source = "../nonroot_account"

  account_id   = var.account_id
  account_name = var.account_name
  region       = var.region
  environment  = var.environment
}

module "../interface_build_upload" {
  source = "../interface_build_upload"
  interface_dir = "${path.module}/../../../interface"
  bucket_name = module.nonroot_account.bucket_name
}
