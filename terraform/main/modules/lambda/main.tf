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


resource "null_resource" "docker_build" {
  provisioner "local-exec" {
    command = <<EOT
      docker build -t ${var.repository.repostory_url}:${var.commit_hash}
      docker push ${var.repository.repostory_url}:${var.commit_hash}
    EOT
  }
}

resource "aws_iam_role_policy" "ecr_read_policy" {
  name     = "ecr_read_policy"
  role     = aws_iam_role.lambda_exec.id
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
  provider      = aws.target
  function_name = var.lambda_name
  role          = aws_iam_role.lambda_exec.arn
  package_type  = "Image"
  timeout       = 15

  image_uri = var.repository.repostiry_url
}

resource "aws_iam_role" "lambda_exec" {
  provider = aws.target
  name     = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_exec_policy" {
  provider   = aws.target
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}