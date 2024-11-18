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

variable "manifest_file" {
  description = "The manifest_file path"
}

variable "root_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "infrastructure_account_id" {
  description = "AWS Account ID of the target account"
  type        = string
}

variable "development_account_id" {
  description = "AWS Account ID of the target account"
  type        = string
}

resource "aws_iam_role" "cross_account_ecr_read_role" {
  provider = aws.target
  name = "cross_account_ecr_read_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": { "AWS" : "arn:aws:iam::${var.development_account_id}:role/lambda_execution_role" }
    }
  ]
}
EOF
}

resource "aws_iam_policy" "cross_account_ecr_read_policy" {
  provider = aws.target
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ],
      "Resource": "arn:aws:ecr:us-east-1:${var.infrastructure_account_id}:repository/*"
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "cross_account_ecr_read_policy_attachment" {
  provider = aws.target
  name = "cross_account_ecr_read_policy_attachment"
  roles     = [aws_iam_role.cross_account_ecr_read_role.name]
  policy_arn = aws_iam_policy.cross_account_ecr_read_policy.arn
}

resource "aws_ecr_repository_policy" "lambda_repo_policy" {
  provider   = aws.target
  for_each   = aws_ecr_repository.lambda_repo
  repository = each.value.name
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::${var.root_account_id}:root"
        ]
      },
      "Action": [
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability",
        "ecr:CompleteLayerUpload"
      ]
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["${aws_iam_role.cross_account_ecr_read_role.arn}"]
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ]
    }
  ]
}
EOF
}
resource "aws_ecr_lifecycle_policy" "lambda_repo_lifecycle" {
  provider   = aws.target
  for_each   = aws_ecr_repository.lambda_repo
  repository = each.value.name
  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images older than 30 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 30
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}
resource "aws_ecr_repository" "lambda_repo" {
  provider = aws.target
  for_each = {
    for key, value in jsondecode(file("${var.manifest_file}")) : key => value
    if value.type == "lambda"
  }
  name = "zudellio_${split(":", each.value.image)[0]}"
}

output "repositories" {
  value = {
    for repo in aws_ecr_repository.lambda_repo : repo.name => repo
  }
}

output "lambda_repo_policy" {
  value = aws_ecr_repository_policy.lambda_repo_policy
}