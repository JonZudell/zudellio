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
  profile = "${var.profile}"
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  region = "us-east-1"
  allowed_account_ids = [var.account_number]
}
# module "sso" {
#   source = "./modules/sso"
# }
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
  #monitoring_role_arn = "${module.organization.monitoring_role_arn}"
}
