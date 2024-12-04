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

variable "dist_dir" {
  type = string
}
variable "bucket_infix" {
  description = "The name of the S3 bucket"
  type        = string
}

resource "random_id" "static_website" {
  byte_length = 8
}

resource "aws_s3_bucket" "static_website" {
  provider = aws.target
  bucket   = "zudellio-${var.bucket_infix}-static-website-${random_id.static_website.hex}"
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

resource "aws_s3_bucket_public_access_block" "static_website_public_access_block" {
  provider = aws.target
  bucket   = aws_s3_bucket.static_website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
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
  }, split(".", each.value)[length(split(".", each.value)) - 1], "text/html")
  source = "${var.dist_dir}/${each.value}"
  acl = "public-read"

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