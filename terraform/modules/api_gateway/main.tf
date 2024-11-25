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

variable "log_key" {

}

resource "aws_api_gateway_rest_api" "api" {
  provider = aws.target
  name        = "api"
  description = "API Gateway for static S3 bucket CDN and Lambda functions"

  lifecycle {
    create_before_destroy = true
  }
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
  cache_cluster_enabled = true
  cache_cluster_size = "0.5"
  xray_tracing_enabled = true

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
    data_trace_enabled = false
    caching_enabled = true
    cache_data_encrypted = true
  }
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  provider = aws.target
  kms_key_id = var.log_key.arn
  name = "/aws/api-gateway/${aws_api_gateway_rest_api.api.id}"
  retention_in_days = 365
}

resource "aws_api_gateway_account" "api_account" {
  provider = aws.target
  cloudwatch_role_arn = aws_iam_role.api_gateway_role.arn

  depends_on = [
    aws_iam_role_policy.api_gateway_cloudwatch_policy
  ]
}

resource "aws_iam_role_policy" "api_gateway_cloudwatch_policy" {
  provider = aws.target
  name = "api-gateway-cloudwatch-policy"
  role = aws_iam_role.api_gateway_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      #{
      #  Effect = "Allow",
      #  Action = [
      #    "logs:CreateLogGroup",
      #    "logs:CreateLogStream",
      #    "logs:DescribeLogGroups",
      #    "logs:DescribeLogStreams"
      #  ],
      #  Resource = "*"
      #},
      {
        Effect = "Allow",
        Action = "logs:PutLogEvents",
        Resource = "arn:aws:logs:*:*:log-group:/aws/api-gateway/*"
      }
    ]
  })
}

output "api_gateway_role" {
  value = aws_iam_role.api_gateway_role
}
output "api_gateway_deployment" {
  value = aws_api_gateway_deployment.api
}
output "api_gateway" {
  value = aws_api_gateway_rest_api.api
}