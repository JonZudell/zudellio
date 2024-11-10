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

resource "aws_s3_bucket" "zudellio_cdn" {
  bucket = "zudellio_cdn"
}

resource "aws_dynamodb_table" "zudellio_contact" {
  name           = "zudellio_contact"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  attribute {
    name = "id"
    type = "S"
  }
}