---
title: aws_tf_bootstrap
version: v1.0.0
author: jon@zudell.io
date: 2024-10-18T00:00:00Z
summary: >-
  **Bootstrapping Terraform** to manage your **AWS environment** can be a huge
  pain. The issue is terraform will not be able to create the the bucket or
  dynamodb table to store the state. This is a **chicken and egg** problem.
  Here's a brief guide on to set it up.
---

**Bootstrapping Terraform** to manage your **AWS environment** can be a huge
pain. The issue is terraform will not be able to create the the bucket or
dynamodb table to store the state. This is a **chicken and egg** problem.
Here's a brief guide on to set it up.

## Software Dependancies

You will need to have the following software installed:

- [Terraform](https://www.terraform.io/downloads.html)
- [AWS CLI](https://aws.amazon.com/cli/)

## Overview

In order for terraform to store its state in AWS it needs to configure the
required provider like so.

```hcl title="main.tf"
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    encrypt = true
    bucket = "terraform-state-infrastructure"
    key    = "terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-dynamodb-locks"
  }
}
```

The issue is terraform will not be able to create the the bucket or dynamodb
table to store the state. This is a chicken and egg problem.

## Resource Creation

We don't like getting our hands dirty with the AWS cli and we will not sully
ourselves by touching the web console. We will use terraform like god intended.
The solution is to create the bucket, associated policies, and dynamodb table
using terraform with no backend. To do so run `terraform apply`. This will
create the resources in AWS.

```hcl title="main.tf"
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    # backend "s3" {
    #   encrypt = true
    #   bucket = "terraform-state-infrastructure"
    #   key    = "terraform.tfstate"
    #   region = "us-east-1"
    #   dynamodb_table = "terraform-dynamodb-locks"
    # }
  }
}

variable "terraform_iam_role" {
  description = "The IAM role to assume when running terraform"
  type        = string
}

resource "aws_s3_bucket" "terraform_state_bucket" {
  bucket = "terraform-state-infrastructure"
}

resource "aws_s3_bucket_policy" "terraform_state_policy" {
  bucket = aws_s3_bucket.terraform_state_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "${var.terraform_iam_role}"
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
      }
    ]
  })
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
```

## Bootstrapping

Afterward executing the terraform apply delete the .terraform directory and the
terraform .tfstate files then uncomment the backend. Doing this will create the
bucket, associated IAM role and dynamodb table. Finally uncomment the backend
and run `terraform init -migrate-state`. Congratulations, you have fulfilled the
capitalist dream of pulling yourself up by your own bootstraps.
