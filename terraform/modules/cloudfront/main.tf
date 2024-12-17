terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [
        aws.target,
        aws.development,
        aws.production
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
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject"
        ]
        Resource = [
          "${aws_s3_bucket.cloudfront_logging_bucket.arn}/*"
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


resource "aws_s3_bucket_acl" "cloudfront_logging_bucket_acl" {
  provider = aws.target
  bucket = aws_s3_bucket.cloudfront_logging_bucket.bucket
  acl    = "log-delivery-write"
}

resource "aws_s3_bucket" "cloudfront_logging_bucket" {
  provider = aws.target
  bucket = "zudellio-cloudfront-logs"
}
resource "aws_s3_bucket_ownership_controls" "cloudfront_logging_bucket" {
  provider = aws.target
  bucket = aws_s3_bucket.cloudfront_logging_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}
resource "aws_s3_bucket_policy" "cloudfront_logging_bucket_policy" {
  provider = aws.target
  bucket = aws_s3_bucket.cloudfront_logging_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action = "s3:PutObject",
        Resource = "${aws_s3_bucket.cloudfront_logging_bucket.arn}/*",
        Condition = {
          ArnLike = {
            "AWS:SourceArn" = aws_cloudfront_distribution.production_s3_distribution.arn
          }
        }
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "development_s3_distribution" {
  provider = aws.target
  #staging = true
  origin {
    domain_name = var.development_site_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.development_site_bucket.bucket}"
    origin_path = ""
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
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
    default_ttl            = 0
    max_ttl                = 0

  }
  restrictions {
    geo_restriction {
      restriction_type = "blacklist"
      locations        = ["KP"]
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  provider = aws.target
  comment = "Origin Access Identity for CloudFront to access S3 bucket"
}

resource "aws_s3_bucket_policy" "development_site_bucket_policy" {
  provider = aws.development
  bucket = var.development_site_bucket.bucket

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn
        },
        Action = "s3:GetObject",
        Resource = "${var.development_site_bucket.arn}/*"
      }
    ]
  })
}
resource "aws_cloudfront_origin_access_identity" "origin_access_identity_prod" {
  provider = aws.target
  comment = "Origin Access Identity for CloudFront to access S3 bucket"
}

resource "aws_s3_bucket_policy" "production_site_bucket_policy" {
  provider = aws.production
  bucket = var.production_site_bucket.bucket

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.origin_access_identity_prod.iam_arn
        },
        Action = "s3:GetObject",
        Resource = "${var.production_site_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "production_s3_distribution" {
  provider = aws.target
  origin {
    domain_name = var.production_site_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.production_site_bucket.bucket}"
    origin_path = ""
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity_prod.cloudfront_access_identity_path
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
    default_ttl            = 900
    max_ttl                = 3600
  }

  restrictions {
    geo_restriction {
      restriction_type = "blacklist"
      locations        = ["KP"]
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