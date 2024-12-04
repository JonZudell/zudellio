terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.target,
      ]
    }
  }
}
resource "random_id" "bucket_suffix" {
  byte_length = 8
}

variable "bucket_prefix" {
  description = "The prefix for the S3 bucket name"
  type = string
}
variable "log_key" {
  description = "The KMS key ID to use for the S3 bucket encryption"
}
resource "aws_s3_bucket" "log_bucket" {
  provider = aws.target
  bucket = "${var.bucket_prefix}-log-bucket-${random_id.bucket_suffix.hex}"
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = var.log_key.arn
        sse_algorithm     = "aws:kms"
      }
    }
  }
}
resource "aws_s3_bucket_policy" "log_bucket_policy" {
  provider = aws.target
  bucket = aws_s3_bucket.log_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "s3:PutObject"
        Resource = "arn:aws:s3:::${aws_s3_bucket.log_bucket.bucket}/*"
        Principal = {
            Service = "cloudfront.amazonaws.com",
            Service = "apigateway.amazonaws.com"
            Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}
output "log_bucket" {
  description = "The name of the log bucket"
  value       = aws_s3_bucket.log_bucket
}
