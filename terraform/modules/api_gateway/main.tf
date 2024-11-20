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

variable "bucket" {
  description = "The s3 bucket to serve static files from"
}

resource "aws_api_gateway_rest_api" "api" {
  provider = aws.target
  name        = "api"
  description = "API Gateway for static S3 bucket CDN and Lambda functions"
}

resource "aws_iam_role" "api_gateway_role" {
  provider = aws.target
  name = "api-gateway-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "apigateway.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}
resource "aws_api_gateway_deployment" "api" {
  provider = aws.target
  depends_on = [
    aws_api_gateway_integration.proxy_integration,
  ]
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "production" {
  provider = aws.target
  deployment_id = aws_api_gateway_deployment.api.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "production"

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_logs.arn
    format = jsonencode({
      requestId = "$context.requestId",
      ip = "$context.identity.sourceIp",
      caller = "$context.identity.caller",
      user = "$context.identity.user",
      requestTime = "$context.requestTime",
      httpMethod = "$context.httpMethod",
      resourcePath = "$context.resourcePath",
      status = "$context.status",
      protocol = "$context.protocol",
      responseLength = "$context.responseLength"
    })
  }

}

resource "aws_api_gateway_method_settings" "production" {
  provider = aws.target
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.production.stage_name
  method_path = "*/*"

  settings {
    logging_level    = "INFO"
    data_trace_enabled = true
  }
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  provider = aws.target
  name = "/aws/api-gateway/${aws_api_gateway_rest_api.api.id}"
  retention_in_days = 7
}

resource "aws_api_gateway_account" "api_account" {
  provider = aws.target
  cloudwatch_role_arn = aws_iam_role.api_gateway_role.arn
}

output "api_gateway_role" {
  value = aws_iam_role.api_gateway_role
}
output "api_url" {
  value = aws_api_gateway_deployment.api.invoke_url
}

output "api_gateway" {
  value = aws_api_gateway_rest_api.api
}