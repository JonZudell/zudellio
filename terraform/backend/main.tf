terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "account_number" {
  description = "AWS Account Number"
  type        = string
}
variable "account_name" {
  description = "AWS Account Name"
  type        = string
}
variable "profile" {
  description = "AWS Configuration Profile"
  type        = string
}
provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile = "${var.profile}"
  region = "us-east-1"
  allowed_account_ids = [var.account_number]
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.account_name}-state-infrastructure"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_ownership_controls" "ownership_controls" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.ownership_controls]

  bucket = aws_s3_bucket.terraform_state.id
  acl    = "private"
}

resource "aws_dynamodb_table" "terraform_locks" {
  name          = "terraform-locks"
  billing_mode  = "PAY_PER_REQUEST"
  hash_key      = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

output "terraform_state_bucket" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "terraform_locks_table" {
  value = aws_dynamodb_table.terraform_locks.name
}