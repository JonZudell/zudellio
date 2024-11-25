resource "aws_kms_key" "cloudfront_log_encryption_key" {
  description             = "KMS key for CloudFront log encryption"
  enable_key_rotation     = true
}

resource "aws_kms_alias" "cloudfront_log_encryption_alias" {
  name          = "alias/cloudfront-log-encryption"
  target_key_id = aws_kms_key.cloudfront_log_encryption_key.key_id
}

output "cloudfront_log_encryption_key" {
  value = aws_kms_key.cloudfront_log_encryption_key
}
