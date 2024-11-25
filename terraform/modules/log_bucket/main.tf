variable "log_kms_key" {
  description = "The KMS key ID to use for the S3 bucket encryption"
  type        = string
}

resource "aws_s3_bucket" "log_bucket" {
  bucket = "my-log-bucket"
  # ...existing code...
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "aws:kms"
        kms_master_key_id = var.log_kms_key.key_id
      }
    }
  }
  # ...existing code...
}

output "log_bucket_name" {
  description = "The name of the log bucket"
  value       = aws_s3_bucket.log_bucket
}
