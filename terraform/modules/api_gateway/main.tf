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

variable "infrastructure_account_id" {

}

variable "log_key" {

}
variable "manifest_file" {
  description = "The manifest file containing all framework resources"
}

variable "lambdas" {}

resource "aws_api_gateway_rest_api" "api" {
  provider = aws.target
  name        = "api"
  description = "API Gateway for static S3 bucket CDN and Lambda functions"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
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
locals {
  manifest = jsondecode(file(var.manifest_file))
}
resource "aws_api_gateway_resource" "lambda_resources" {
  provider = aws.target
  for_each = {
    for key, value in jsondecode(file("${var.manifest_file}")) : key => value
    if value.type == "lambda"
  }
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = each.value.path
}

resource "aws_api_gateway_method" "lambda_methods" {
  provider = aws.target
  for_each = aws_api_gateway_resource.lambda_resources
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = each.value.id
  http_method   = upper(local.manifest[each.key].method)
  authorization = "AWS_IAM"

  depends_on = [aws_api_gateway_resource.lambda_resources]
}

resource "aws_api_gateway_integration" "lambda_integrations" {
  provider = aws.target
  for_each = var.lambdas
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.lambda_resources[each.key].id
  http_method             = aws_api_gateway_method.lambda_methods[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = each.value.invoke_arn

  depends_on = [aws_api_gateway_method.lambda_methods]
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
  #kms_key_id = var.log_key.arn
  name = "/aws/api-gateway/${aws_api_gateway_rest_api.api.id}"
  retention_in_days = 365
}

resource "aws_lambda_permission" "api_gateway_permission" {
  provider = aws.target
  for_each = var.lambdas
  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

# resource "aws_api_gateway_account" "api_account" {
#   provider = aws.target
#   cloudwatch_role_arn = aws_iam_role.api_gateway_role.arn

#   depends_on = [
#     aws_iam_role_policy.api_gateway_cloudwatch_policy
#   ]
# }

resource "aws_iam_role_policy" "api_gateway_cloudwatch_policy" {
  provider = aws.target
  name = "api-gateway-cloudwatch-policy"
  role = aws_iam_role.api_gateway_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:log-group:/aws/api-gateway/*"
      },
      {
        Effect = "Allow",
        Action = [
          "kms:Encrypt",
          "kms:GenerateDataKey"
        ],
        Resource = "arn:aws:kms:us-east-1:${var.infrastructure_account_id}:key/${var.log_key.key_id}"
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = [
          for lambda in var.lambdas : lambda.arn
        ]
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