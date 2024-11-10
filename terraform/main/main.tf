provider "aws" {
  region                      = "us-east-1"
  access_key                  = "${var.access_key}"
  secret_key                  = "${var.secret_key}"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    s3 = "${var.aws_endpoint_url}"
    dynamodb = "${var.aws_endpoint_url}"
  }
}

module "interface_build_upload" {
  source = "../modules/interface_build_upload"
  interface_dir = "${path.module}/../../interface"
  bucket_name = "zudellio_cdn"
}
