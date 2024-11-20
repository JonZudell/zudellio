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

resource "aws_api_gateway_resource" "proxy" {
  provider = aws.target
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_method" {
  provider = aws.target
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
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
resource "aws_iam_role_policy_attachment" "api_gateway_role_attachment" {
  provider = aws.target
  role       = aws_iam_role.api_gateway_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}
resource "aws_iam_policy" "api_gateway_s3_policy" {
  provider = aws.target
  name = "api-gateway-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject"
        ],
        Resource = "${var.bucket.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "api_gateway_cloudwatch_policy" {
  provider = aws.target
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
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents",
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "api_gateway_s3_read_policy" {
  provider = aws.target
  role = aws_iam_role.api_gateway_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ],
        Resource = [
          "${var.bucket.arn}",
          "${var.bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "interface_bucket_policy" {
  provider = aws.target
  bucket = var.bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "apigateway.amazonaws.com"
        },
        Action   = "s3:GetObject"
        Resource = "${var.bucket.arn}/*"
      }
    ]
  })
}

resource "aws_api_gateway_integration" "proxy_integration" {
  provider = aws.target
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_method.http_method
  type        = "AWS"
  integration_http_method = "GET"
  uri         = "arn:aws:apigateway:us-east-1:s3:path/${var.bucket.bucket}/{proxy}"
  credentials = aws_iam_role.api_gateway_role.arn
  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
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