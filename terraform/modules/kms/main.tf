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
variable "development_account_id" {

}
variable "infrastructure_account_id" {

}
resource "aws_kms_key" "log_encryption_key" {
  provider = aws.target
  description             = "KMS key for CloudFront log encryption"
  enable_key_rotation     = true
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.infrastructure_account_id}:root"
        }
        Action = "kms:*"
        Resource = "*"
      },
      {
        Sid = "Allow APIGateway to use the key"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:GenerateDataKey"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "apigateway.amazonaws.com"
          }
        }
      },
      {
        Sid = "Allow CloudWatch to use the key"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.development_account_id}:root"
        }
        Action = [
          "kms:Encrypt",
          "kms:GenerateDataKey"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "logs.amazonaws.com"
          }
        }
      }
    ]
  })
}
resource "aws_kms_alias" "log_encryption_alias" {
  provider = aws.target
  name          = "alias/log-encryption"
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