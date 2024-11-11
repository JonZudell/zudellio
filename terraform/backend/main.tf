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
variable "monitoring_account_number" {
  description = "The account number of the monitoring account"
}
provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  shared_config_files      = ["~/.aws/config"]
  profile = var.profile
  region = "us-east-1"
  allowed_account_ids = [var.account_number]
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.account_name}-state-infrastructure"
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
resource "aws_s3_bucket_policy" "terraform_state_policy" {
  bucket = aws_s3_bucket.terraform_state.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.account_number}:root"
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.terraform_state.arn}",
          "${aws_s3_bucket.terraform_state.arn}/*"
        ]
        Condition = {
          StringEquals = {
            "aws:RequestedRegion" = "us-east-1"
          }
          ArnLike = {
            "aws:PrincipalArn" = "arn:aws:iam::*:role/AdministratorAccess"
          }
        }
      }
    ]
  })
}

module "organization" {
  source = "./modules/organization"
  monitoring_account_number = var.monitoring_account_number
}


output "terraform_state_bucket" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "terraform_locks_table" {
  value = aws_dynamodb_table.terraform_locks.name
}