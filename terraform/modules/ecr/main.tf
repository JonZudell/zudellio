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

variable "ecr_key" {
}

variable "org_id" {

}

variable "production_account_id" {
  description = "AWS Account ID of the target account"
  type        = string
}

variable "development_account_id" {
  description = "AWS Account ID of the target account"
  type        = string
}

variable "infrastructure_account_id" {
  description = "AWS Account ID of the target account"
  type        = string
}

variable "manifest_prefix" {
  description = "The manifest_file path"
}
variable "root_account_id" {
  description = "AWS Account Number"
  type        = string
}

resource "aws_iam_policy" "cross_account_ecr_read_policy_all" {
  provider = aws.target
  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Effect" = "Allow",
        "Action" = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken"
        ],
        "Resource" = [
          "arn:aws:ecr:us-east-1:${var.infrastructure_account_id}:repository/*",
        ]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "cross_account_ecr_read_policy_attachment_all" {
  provider = aws.target
  name = "cross_account_ecr_read_policy_attachment_all"
  roles     = [aws_iam_role.cross_account_ecr_read_role.name]
  policy_arn = aws_iam_policy.cross_account_ecr_read_policy_all.arn
}

resource "aws_iam_role" "cross_account_ecr_read_role" {
  provider = aws.target
  name = "cross_account_ecr_read_role"
  assume_role_policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Effect" = "Allow",
        "Action" = "sts:AssumeRole",
        "Principal" = {
          "AWS" : [
            "arn:aws:iam::${var.development_account_id}:root",
            "arn:aws:iam::${var.production_account_id}:root"
          ],
          "Service" : "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "cross_account_ecr_read_policy_attachment" {
  provider = aws.target
  name = "cross_account_ecr_read_policy_attachment"
  roles     = [aws_iam_role.cross_account_ecr_read_role.name]
  policy_arn = aws_iam_policy.cross_account_ecr_read_policy_all.arn
}

resource "aws_ecr_repository_policy" "lambda_repo_policy" {
  provider   = aws.target
  for_each   = aws_ecr_repository.lambda_repo
  repository = each.value.name
  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Effect" = "Allow",
        "Principal" = {
          "AWS" = [
            "arn:aws:iam::${var.infrastructure_account_id}:root",
            "arn:aws:iam::${var.root_account_id}:root"
          ]
        },
        "Action" = [
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
        "Sid": "LambdaECRImageCrossOrgRetrievalPolicy",
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken"
        ],
        "Condition": {
          "StringEquals": {
            "aws:SourceOrgID": var.org_id
          }
        }
      },
      {
      "Sid": "CrossAccountPermission",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ],
      "Principal": {
        "AWS": "arn:aws:iam::${var.development_account_id}:root"
      }
    },
      {
      "Sid": "LambdaECRImageCrossAccountRetrievalPolicy",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ],
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Condition": {
        "StringLike": {
          "aws:sourceARN": "arn:aws:lambda:us-east-1:${var.development_account_id}:function:*"
        }
      }
    }
    ]
  })
}

resource "aws_ecr_lifecycle_policy" "lambda_repo_lifecycle" {
  provider   = aws.target
  for_each   = aws_ecr_repository.lambda_repo
  repository = each.value.name
  policy = jsonencode({
    "rules" = [
      {
        "rulePriority" = 1,
        "description" = "Expire untagged images older than 30 days",
        "selection" = {
          "tagStatus" = "untagged",
          "countType" = "sinceImagePushed",
          "countUnit" = "days",
          "countNumber" = 30
        },
        "action" = {
          "type" = "expire"
        }
      }
    ]
  })
}

resource "aws_ecr_repository" "lambda_repo" {
  provider = aws.target
  for_each = {
    for key, value in jsondecode(file("${var.manifest_prefix}_lambdas.json")) : key => value
    if value.type == "lambda"
  }
  name                 = "${split(":", each.value.image)[0]}"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = var.ecr_key.arn
  }
}

output "repositories" {
  value = {
    for repo in aws_ecr_repository.lambda_repo : repo.name => repo
  }
}

output "lambda_repo_policy" {
  value = aws_ecr_repository_policy.lambda_repo_policy
}