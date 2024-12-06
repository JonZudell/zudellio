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
variable "target_account_id" {
  type = string
}

variable "image_tag" {
  description = "The commit hash"
  type        = string
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
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken"
        ]
        Resource = [
          "arn:aws:ecr:us-east-1:${var.infrastructure_account_id}:repository/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = [
          aws_sqs_queue.lambda_dlq.arn
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

resource "aws_iam_role_policy_attachment" "vpc_access_policy" {
  provider   = aws.target
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_sqs_queue" "lambda_dlq" {
  provider   = aws.target
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
    target_arn = aws_sqs_queue.lambda_dlq.arn
  }
  //code_signing_config_arn = var.code_signing_config_arn
  image_uri = "${each.value.repository_url}:${var.image_tag}"
}
# output "lambda_image_uri_map" {
#   description = "Map of Lambda function names to their image URIs"
#   value = {
#     for name, repo in var.repositories : repo.repository_url => aws_lambda_function.lambda[name].image_uri
#   }
# }
output "lambdas" {
  value = aws_lambda_function.lambda
}