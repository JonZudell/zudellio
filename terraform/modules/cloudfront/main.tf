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
variable "development_site_bucket" {
  description = "The s3 bucket to serve static files from"
}
variable "production_site_bucket" {
  description = "The s3 bucket to serve static files from"
}
variable "logging_bucket"{
  description = "The s3 bucket to store CloudFront logs"
}

variable "infrastructure_account_id" {}

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
          "${var.production_site_bucket.arn}/*",
          "${var.development_site_bucket.arn}/*"
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

resource "aws_cloudfront_distribution" "development_s3_distribution" {
  provider = aws.target
  origin {
    domain_name = var.development_site_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.development_site_bucket.bucket}"
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

  aliases = ["dev.zudell.io"]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for serving static files from S3"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.development_site_bucket.bucket}"

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

    # lambda_function_association {
    #   event_type   = "origin-request"
    #   lambda_arn   = aws_lambda_function.lambda.arn
    #   include_body = false
    # }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

}
resource "aws_cloudfront_distribution" "production_s3_distribution" {
  provider = aws.target
  origin {
    domain_name = var.production_site_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.production_site_bucket.bucket}"
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
    target_origin_id = "S3-${var.production_site_bucket.bucket}"

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

    # lambda_function_association {
    #   event_type   = "origin-request"
    #   lambda_arn   = aws_lambda_function.lambda.arn
    #   include_body = false
    # }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

}
output "development_cloudfront_distribution" {
  description = "The CloudFront distribution"
  value       = aws_cloudfront_distribution.development_s3_distribution
}
output "production_cloudfront_distribution" {
  description = "The CloudFront distribution"
  value       = aws_cloudfront_distribution.production_s3_distribution
}