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

variable "manifests_dir" {
  description = "The directory for manifests"
}
variable "development_account_id" {
  description = "AWS Account Number"
  type        = string
}

variable "production_account_id" {
  description = "AWS Account Number"
  type        = string
}
resource "aws_ecr_repository_policy" "lambda_repo_policy" {
  provider   = aws.target
  for_each   = aws_ecr_repository.lambda_repo
  repository = each.value.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = [
            "*"
          ]
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
      }
    ]
  })
}
resource "aws_ecr_lifecycle_policy" "lambda_repo_lifecycle" {
  provider   = aws.target
  for_each   = aws_ecr_repository.lambda_repo
  repository = each.value.name
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images older than 30 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 30
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
resource "aws_ecr_repository" "lambda_repo" {
  provider = aws.target
  for_each = {
    for key, value in jsondecode(file("${var.manifests_dir}/${[for file in fileset(var.manifests_dir, "*.json") : file if startswith(file, "flattened_manifest")][0]}")) : key => value
    if value.type == "lambda"
  }
  name = "zudellio_${split(":", each.value.image)[0]}"
}

output "repositories" {
  value = {
    for repo in aws_ecr_repository.lambda_repo : repo.name => repo
  }
}