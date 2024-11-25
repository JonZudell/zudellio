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

<<<<<<< HEAD
variable "url_rewrite_lambda" {

=======
variable "logging_bucket"{
  description = "The s3 bucket to store CloudFront logs"
}

variable "url_rewrite_lambda" {
  description = "The Lambda function to rewrite URLs"
}

variable "web_acl_id" {
  description = "The WAF Web ACL ID to associate with the CloudFront distribution"
}

variable "kms_key" {
  description = "The KMS key to use for CloudFront log encryption"
>>>>>>> 6049b7d (local)
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
    domain_name = var.site_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.site_bucket.bucket}"
    origin_path = "/content"
    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  origin {
    domain_name = var.site_bucket_failover.bucket_regional_domain_name
    origin_id   = "S3-${var.site_bucket_failover.bucket}"
    origin_path = "/content"
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

<<<<<<< HEAD
    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = var.url_rewrite_lambda.arn
      include_body = false
    }

=======
>>>>>>> 6049b7d (local)
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
      lambda_arn   = var.url_rewrite_lambda.arn
      include_body = false
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  logging_config {
    include_cookies = false
    bucket          = "mylogs.s3.amazonaws.com"
    prefix          = "myprefix"
  }

  viewer_certificate {
    acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  web_acl_id = var.web_acl_id
}

output "cloudfront_distribution" {
  description = "The CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution
}