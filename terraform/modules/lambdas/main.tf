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

variable "repositories" {
}

variable "infrastructure_account_id" {
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
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_execution_policy" {
  provider = aws.target
  name     = "lambda_execution_policy"
  policy   = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sts:AssumeRole",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ],
      "Resource": [
        "arn:aws:iam::${var.infrastructure_account_id}:role/cross_account_ecr_read_role",
        "arn:aws:ecr:us-east-1:${var.infrastructure_account_id}:repository/*"
      ]
    }
  ]
}
EOF
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

  provisioner "local-exec" {
    command = <<EOT
      aws ecr describe-images --repository-name ${each.value.repository_name} --image-ids imageTag=${var.image_tag} || exit 1
    EOT
  }
  for_each      = var.repositories
  provider      = aws.target
  function_name = each.key
  role          = aws_iam_role.lambda_execution_role.arn
  package_type  = "Image"
  timeout       = 15

  image_uri = "${each.value.repository_url}:${var.image_tag}"
}