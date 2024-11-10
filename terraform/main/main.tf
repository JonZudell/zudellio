provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile = "${var.profile}"
  region = "us-east-1"
  allowed_account_ids = [var.account_number]
}

module "interface_build_upload" {
  source = "../modules/interface_build_upload"
  interface_dir = "${path.module}/../../interface"
  bucket_name = "${var.account_name}-cdn-development"
}

# module "interface_dynamodb" {
#   source = "../modules/interface_dynamodb"
# }

module "api_gateway" {
  source = "../modules/api_gateway"
  s3_bucket_name = "${module.interface_build_upload.bucket_name}"
}
