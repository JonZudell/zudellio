terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
resource "aws_ecr_repository" "lambda_repo" {
  name = var.ecr_repo_name
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
}

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