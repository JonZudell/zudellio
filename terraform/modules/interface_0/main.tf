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

variable "environment" {
  description = "The environment to deploy to"
  type        = string
}

variable "dist_dir" {
  type = string
}
variable "bucket_infix" {
  description = "The name of the S3 bucket"
  type        = string
}
variable "api_gateway" {

}
variable "api_gateway_role" {

}
#variable "cloudfront_access_id" {
#
#}
resource "random_id" "static_website" {
  byte_length = 8
}

resource "aws_s3_bucket" "static_website" {
  provider = aws.target
  bucket   = "zudellio-${var.bucket_infix}-static-website-${random_id.static_website.hex}"
}
resource "aws_s3_bucket_policy" "static_website_policy" {
  provider = aws.target
  bucket = aws_s3_bucket.static_website.bucket
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = [
          "s3:GetObject", 
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.static_website.arn}",
          "${aws_s3_bucket.static_website.arn}/*"
        ]
      }
    ]
  })
}
resource "aws_s3_bucket_ownership_controls" "static_website_ownership_controls" {
  provider = aws.target
  bucket   = aws_s3_bucket.static_website.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "static_website_acl" {
  provider = aws.target
  depends_on = [
    aws_s3_bucket_ownership_controls.static_website_ownership_controls,
    aws_s3_bucket.static_website,
    aws_s3_bucket_public_access_block.static_website_public_access_block
  ]
  bucket = aws_s3_bucket.static_website.id
  acl    = "private"

}
resource "aws_s3_bucket_cors_configuration" "static_website_cors" {
  provider = aws.target
  bucket = aws_s3_bucket.static_website.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
  }
}
resource "aws_s3_bucket_public_access_block" "static_website_public_access_block" {
  provider = aws.target
  bucket   = aws_s3_bucket.static_website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_object" "interface_files" {
  provider = aws.target
  etag     = filemd5("${var.dist_dir}/${each.value}")
  lifecycle {
    create_before_destroy = true
    ignore_changes = [
      etag,
    ]
  }
  tags = {
    etag = filemd5("${var.dist_dir}/${each.value}")
  }
  depends_on = [aws_s3_bucket.static_website]
  for_each   = toset([for file in fileset("${var.dist_dir}", "**/*") : file if !(startswith(file, "ssg") || file == "rewrites.json")])
  bucket     = aws_s3_bucket.static_website.id
  key        = each.value
  content_type = lookup({
    "html" = "text/html",
    "css"  = "text/css",
    "js"   = "application/javascript",
    "png"  = "image/png",
    "jpg"  = "image/jpeg",
    "jpeg" = "image/jpeg",
    "gif"  = "image/gif",
    "svg"  = "image/svg+xml"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
  source = "${var.dist_dir}/${each.value}"

}

resource "aws_s3_bucket_website_configuration" "interface_config" {
  provider = aws.target
  bucket   = aws_s3_bucket.static_website.id

  index_document {
    suffix = "index.html"
  }

  dynamic "routing_rule" {
    for_each = jsondecode(file("${var.dist_dir}/rewrites.json")).rewrites

    content {
      condition {
        key_prefix_equals = routing_rule.value.source
      }

      redirect {
        replace_key_with = routing_rule.value.destination
      }
    }
  }
}
resource "aws_s3_bucket_policy" "zudellio_bucket_policy" {
  provider = aws.target
  bucket = aws_s3_bucket.static_website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.static_website.arn}/*"
      }
    ]
  })
}
output "static_website_bucket" {
  value = aws_s3_bucket.static_website
}