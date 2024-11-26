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
variable "certificate_arn" {
  description = "The ARN of the ACM certificate to use for CloudFront"
  type        = string
}
variable "site_bucket" {
  description = "The s3 bucket to serve static files from"
}

variable "logging_bucket"{
  description = "The s3 bucket to store CloudFront logs"
}

variable "infrastructure_account_id" {}
variable "image_tag" {}

variable "url_rewrite_get_ecr" {
}

resource "aws_lambda_function" "lambda" {
  lifecycle {
    ignore_changes = [
      image_uri,
    ]
    create_before_destroy = true
  }

  provider      = aws.target
  function_name = "url_rewrite_lambda"
  role          = aws_iam_role.lambda_execution_role.arn
  package_type  = "Image"
  timeout       = 15

  image_uri = "${var.url_rewrite_get_ecr.repository_url}:${var.image_tag}"
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
resource "aws_iam_role" "cloudfront_role" {
  provider = aws.target
  name = "cloudfront-role"

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

resource "aws_iam_policy" "cloudfront_policy" {
  provider = aws.target
  name        = "cloudfront-role-policy"
  description = "Policy for CloudFront to access S3 bucket"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = [
          "${var.site_bucket.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "acm:DescribeCertificate"
        ]
        Resource = [
          "${var.certificate_arn}"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudfront_policy_attachment" {
  provider = aws.target
  role       = aws_iam_role.cloudfront_role.name
  policy_arn = aws_iam_policy.cloudfront_policy.arn
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  provider = aws.target
  origin {
    domain_name = var.site_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.site_bucket.bucket}"
    origin_path = ""
    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  aliases = ["zudell.io", "www.zudell.io"]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for serving static files from S3"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.site_bucket.bucket}"

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = aws_lambda_function.lambda.arn
      include_body = false
    }

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = aws_lambda_function.lambda.arn
      include_body = false
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  #logging_config {
  #  include_cookies = false
  #  bucket          = var.logging_bucket.id
  #}

  viewer_certificate {
    acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  #web_acl_id = var.web_acl_id
}

output "cloudfront_distribution" {
  description = "The CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution
}