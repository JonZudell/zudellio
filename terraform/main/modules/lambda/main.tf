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

variable "lambda_name" {
  type = string
}

variable "infrastructure_profile" {
  description = "The infrastructure profile (e.g., dev, prod)"
  type        = string
}

variable "repository" {
}

variable "commit_hash" {
  description = "The commit hash"
  type        = string
}

variable "lambda_exec" {

}

variable "manifests_dir" {
  description = "The directory containing manifest files"
  type        = string
}
locals {
  lambda_manifests = {
    for key, value in jsondecode(file("${var.manifests_dir}/${[for file in fileset(var.manifests_dir, "*.json") : file if startswith(file, "flattened_manifest")][0]}")) : key => value
    if value.type == "lambda"
  }

  trimmed_lambda_name = replace(var.lambda_name, "zudellio_", "")
}

resource "null_resource" "docker_build" {
  provisioner "local-exec" {
    command = <<EOT
      DOCKERFILE_DIR=$(dirname ${local.lambda_manifests[local.trimmed_lambda_name].Dockerfile})
      docker build -t ${var.repository.repository_url}:${var.commit_hash} -f ${local.lambda_manifests[local.trimmed_lambda_name].Dockerfile} $DOCKERFILE_DIR
      docker push ${var.repository.repository_url}:${var.commit_hash}
    EOT
  }
}

resource "aws_iam_role_policy" "ecr_read_policy" {
  name     = "ecr_read_policy"
  role     = var.lambda_exec.id
  provider = aws.target
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = var.repository.arn
      }
    ]
  })
}

resource "aws_lambda_function" "lambda" {
  depends_on    = [null_resource.docker_build]
  provider      = aws.target
  function_name = var.lambda_name
  role          = var.lambda_exec.arn
  package_type  = "Image"
  timeout       = 15

  image_uri = "${var.repository.repository_url}:${var.commit_hash}"
}

resource "aws_iam_role_policy_attachment" "lambda_exec_policy" {
  provider   = aws.target
  role       = var.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}