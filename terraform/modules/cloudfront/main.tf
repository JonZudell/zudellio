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
resource "aws_cloudfront_distribution" "s3_distribution" {
  provider = aws.target
  origin {
    domain_name = "${var.bucket.bucket}.s3-website-us-east-1.amazonaws.com"
    origin_id   = "S3-${var.bucket.bucket}"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for serving static files from S3"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket.bucket}"

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
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  provider = aws.target
  comment = "Origin access identity for CloudFront to access S3"
}
output "cloudfront_distribution" {
  description = "The CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution
}
output "cloudfront_url" {
  description = "The URL of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}
output "cloudfront_access_identity_path" {
  description = "The CloudFront origin access identity"
  value       = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
}