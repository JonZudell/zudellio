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

variable "subnet_ids" {
  description = "List of subnet IDs for the Lambda function"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs for the Lambda function"
  type        = list(string)
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
        Resource = "arn:aws:lambda:${var.infrastructure_account_id}:function:*"
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
resource "aws_sqs_queue" "lambda_dlq" {
  name = "lambda_dlq"
}
resource "aws_lambda_function" "lambda" {
  lifecycle {
    create_before_destroy = true
  }

  for_each      = var.repositories
  provider      = aws.target
  function_name = each.key
  role          = aws_iam_role.lambda_execution_role.arn
  package_type  = "Image"
  timeout       = 15
  tracing_config {
    mode = "Active"
  }
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
  dead_letter_config {
    target_arn = aws_sqs_queue.lambda_dlq
  }
  //code_signing_config_arn = var.code_signing_config_arn
  reserved_concurrent_executions = 2

  image_uri = "${each.value.repository_url}:${var.image_tag}"
}