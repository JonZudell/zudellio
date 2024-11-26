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

variable "lambda_log_key" {

}

variable "repositories" {
}

variable "infrastructure_account_id" {
  type = string
}

variable "image_tag" {
  description = "The commit hash"
  type        = string
}
resource "aws_iam_role" "cloudfront_lambda_role" {
  provider = aws.target
  name     = "cloudfront_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "cloudfront_lambda_policy" {
  provider = aws.target
  name     = "cloudfront_lambda_policy"
  role     = aws_iam_role.cloudfront_lambda_role.id
  policy   = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "lambda:InvokeFunction"
        Resource = "*"
      }
    ]
  })
}
resource "aws_iam_role_policy_attachment" "basic_lambda_execution" {
  provider   = aws.target
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role" "lambda_execution_role" {
  provider           = aws.target
  name               = "lambda_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_execution_policy" {
  provider = aws.target
  name     = "lambda_execution_policy"
  policy   = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = [
          "arn:aws:ecr:us-east-1:${var.infrastructure_account_id}:repository/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sts:AssumeRole",
        ]
        Resource = [
          "arn:aws:iam::${var.infrastructure_account_id}:role/cross_account_ecr_read_role",
        ]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_execution_policy_attachment" {
  name       = "lambda_execution_policy_attachment"
  provider   = aws.target
  roles      = [aws_iam_role.lambda_execution_role.name]
  policy_arn = aws_iam_policy.lambda_execution_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logging" {
  provider   = aws.target
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "lambda" {
  lifecycle {
    ignore_changes = [
      image_uri,
    ]
    create_before_destroy = true
  }

  for_each      = var.repositories
  provider      = aws.target
  function_name = each.key
  role          = aws_iam_role.lambda_execution_role.arn
  package_type  = "Image"
  timeout       = 15

  image_uri = "${each.value.repository_url}:${var.image_tag}"
}
output "url_rewrite_lambda" {
  value = aws_lambda_function.lambda["url_rewrite_get"]
}