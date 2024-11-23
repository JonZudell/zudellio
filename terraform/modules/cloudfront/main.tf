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

variable "certificate_arn" {
  description = "The ARN of the ACM certificate to use for CloudFront"
  type        = string
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

resource "aws_iam_policy" "cloudfront_s3_policy" {
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
          "${var.bucket.arn}/*"
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
resource "aws_iam_policy" "cloudfront_full_policy" {
  provider = aws.target
  name        = "cloudfront-full-policy"
  description = "Full policy for CloudFront"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
          "s3:ListBucketMultipartUploads",
          "s3:GetBucketLocation",
          "s3:ListBucketVersions",
          "s3:GetBucketPolicy",
          "s3:GetBucketAcl",
          "s3:GetBucketCORS",
          "s3:GetBucketLogging",
          "s3:GetBucketNotification",
          "s3:GetBucketRequestPayment",
          "s3:GetBucketTagging",
          "s3:GetBucketVersioning",
          "s3:GetBucketWebsite",
          "s3:GetLifecycleConfiguration",
          "s3:GetReplicationConfiguration",
          "s3:GetObjectAcl",
          "s3:GetObjectTagging",
          "acm:ListCertificates",
          "acm:GetCertificate",
          "s3:GetObjectTorrent",
          "s3:GetObjectVersion",
          "s3:GetObjectVersionAcl",
          "s3:GetObjectVersionTagging",
          "s3:GetObjectVersionTorrent",
          "acm:DescribeCertificate",
          "cloudfront:GetDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:ListDistributions",
          "cloudfront:ListTagsForResource"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudfront_full_policy_attachment" {
  provider = aws.target
  role       = aws_iam_role.cloudfront_role.name
  policy_arn = aws_iam_policy.cloudfront_full_policy.arn
}

resource "aws_iam_role_policy_attachment" "cloudfront_s3_policy_attachment" {
  provider = aws.target
  role       = aws_iam_role.cloudfront_role.name
  policy_arn = aws_iam_policy.cloudfront_s3_policy.arn
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  provider = aws.target
  origin {
    domain_name = var.bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.bucket.bucket}"
    #s3_origin_config {
    #  origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    #}
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
    acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

#resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
#  provider = aws.target
#  comment = "Origin access identity for CloudFront to access S3"
#}
output "cloudfront_distribution" {
  description = "The CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution
}
output "cloudfront_url" {
  description = "The URL of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}
#output "cloudfront_access_id" {
#  description = "The CloudFront origin access identity"
#  value       = aws_cloudfront_origin_access_identity.origin_access_identity.id
#}

#output "cloudfront_acm_role" {
#  value = aws_iam_role.cloudfront_role
#}