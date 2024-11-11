terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    encrypt = true
    bucket = "zudellio-state-infrastructure"
    key    = "terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile = "${var.profile}"
  region = "us-east-1"
  allowed_account_ids = [var.account_number]
}

module "interface_build_upload" {
  source = "./modules/interface_build_upload"
  interface_dir = "${path.module}/../../interface"
  bucket_name = "${var.account_name}-cdn-development"
}

# module "interface_dynamodb" {
#   source = "../modules/interface_dynamodb"
# }

module "api_gateway" {
  source = "./modules/api_gateway"
  bucket = "${module.interface_build_upload.bucket}"  
}
