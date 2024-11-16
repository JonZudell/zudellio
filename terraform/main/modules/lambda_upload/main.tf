terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_ecr_registry_policy" "lambda_repo_policy" {
  registry_id = aws_ecr_repository.lambda_repo.registry_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
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
  repository = aws_ecr_repository.lambda_repo.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images older than 30 days"
        selection    = {
          tagStatus = "untagged"
          countType = "sinceImagePushed"
          countUnit = "days"
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
  for_each = {
    for key, value in jsondecode(file("${var.manifests_dir}/FLATTENED_MANIFEST_7EC7D68E.JSON")) : key => value
    if value.type == "lambda"
  }
  name = "zudellio_${var.ecr_repo_name}_${each.key}"
  image = replace(each.value.image, ":${split(":", each.value.image)[1]}", "")
}

# resource "null_resource" "docker_build" {
#   provisioner "local-exec" {
#     command = <<EOT
#       docker build -t ${aws_ecr_repository.lambda_repo.repository_url}:latest .
#       aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${aws_ecr_repository.lambda_repo.repository_url}
#       docker push ${aws_ecr_repository.lambda_repo.repository_url}:latest
#     EOT
#   }

#   depends_on = [aws_ecr_repository.lambda_repo]
# }

variable "region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "ecr_repo_name" {
  description = "The name of the ECR repository"
  type        = string
  default     = "lambda-docker-repo"
}