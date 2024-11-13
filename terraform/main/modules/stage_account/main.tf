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

# module "interface_build_upload" {
#   source = "../interface_build_upload"
#   interface_dir = "${path.module}/../../../interface"
#   bucket_name = module.nonroot_account.bucket_name
# }
