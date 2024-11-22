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

#variable "certificate_arn" {
#  description = "The ARN of the ACM certificate to use for CloudFront"
#  type        = string
#}

resource "aws_cloudfront_distribution" "s3_distribution" {
  provider = aws.target
  origin {
    domain_name = var.bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.bucket.bucket}"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
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
    #acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
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
output "cloudfront_access_id" {
  description = "The CloudFront origin access identity"
  value       = aws_cloudfront_origin_access_identity.origin_access_identity.id
}