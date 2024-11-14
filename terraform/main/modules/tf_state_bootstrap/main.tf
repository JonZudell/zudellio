terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.root
      ]
    }
  }
}

variable "root_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "root_account_name" {
  description = "AWS Account Name"
  type        = string
}

resource "aws_s3_bucket" "terraform_state_bucket" {
  bucket = "${var.root_account_name}-state-infrastructure"
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.terraform_state_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_ownership_controls" "ownership_controls" {
  bucket = aws_s3_bucket.terraform_state_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "terraform_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.ownership_controls]

  bucket = aws_s3_bucket.terraform_state_bucket.id
  acl    = "private"
}

resource "aws_dynamodb_table" "terraform_dynamodb_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

resource "aws_s3_bucket_policy" "terraform_state_policy" {
  bucket = aws_s3_bucket.terraform_state_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.root_account_id}:root"
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.terraform_state_bucket.arn}",
          "${aws_s3_bucket.terraform_state_bucket.arn}/*"
        ]
        Condition = {
          StringEquals = {
            "aws:RequestedRegion" = "us-east-1"
          }
          ArnLike = {
            "aws:PrincipalArn" = "arn:aws:iam::${var.root_account_id}:role/AdministratorAccess"
          }
        }
      }
    ]
  })
}

output "terraform_state_bucket" {
  value = aws_s3_bucket.terraform_state_bucket.bucket
}

output "terraform_dynamodb_locks" {
  value = aws_dynamodb_table.terraform_dynamodb_locks.name
}