terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
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


resource "aws_organizations_account" "account" {
  provider = aws.root
  name     = var.account_name
  email    = var.account_email
}

resource "aws_iam_role" "AdminAccessSSOFromRoot" {
  provider = aws.target
  name     = "AdminAccessSSOFromRoot"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${var.root_account_id}:root"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_s3_bucket" "static_website" {
  bucket = "zudellio-${var.bucket_infix}-static-website"
}

resource "aws_s3_bucket_ownership_controls" "static_website_ownership_controls" {
  bucket = aws_s3_bucket.static_website.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "static_website_acl" {
  depends_on = [
      aws_s3_bucket_ownership_controls.static_website_ownership_controls, 
      aws_s3_bucket.static_website,
      aws_s3_bucket_public_access_block.static_website_public_access_block
    ]
  bucket = aws_s3_bucket.static_website.id
  acl    = "public-read"

}
resource "aws_s3_bucket_public_access_block" "static_website_public_access_block" {
  bucket = aws_s3_bucket.static_website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

module "interface_build_upload" {
  source = "../interface_build_upload"
  interface_dir = "${abspath(path.module)}/../../../../interface"
  bucket = aws_s3_bucket.static_website
}
output "s3_website_url" {
  description = "The URL of the S3 static website"
  value       = module.interface_build_upload.s3_website_url
}