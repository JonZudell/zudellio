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
resource "aws_kms_key" "log_encryption_key" {
  provider = aws.target
  description             = "KMS key for CloudFront log encryption"
  enable_key_rotation     = true
}

resource "aws_kms_alias" "log_encryption_alias" {
  provider = aws.target
  name          = "alias/cloudfront-log-encryption"
  target_key_id = aws_kms_key.log_encryption_key.key_id
}
resource "aws_kms_key" "ecr_encryption_key" {
  provider = aws.target
  description             = "KMS key for ECR encryption"
  enable_key_rotation     = true
}

resource "aws_kms_alias" "ecr_encryption_alias" {
  provider = aws.target
  name          = "alias/ecr-encryption"
  target_key_id = aws_kms_key.ecr_encryption_key.key_id
}

output "ecr_key" {
  value = aws_kms_key.ecr_encryption_key
}
output "log_key" {
  value = aws_kms_key.log_encryption_key
}