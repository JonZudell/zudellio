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

variable "bucket" {
  description = "The S3 bucket"
}

resource "aws_s3_object" "interface_files" {
  provider = aws.target
  etag     = filemd5("${var.dist_dir}/${each.value}")
  lifecycle {
    create_before_destroy = true
    # ignore_changes = [
    #   etag,
    # ]
  }
  depends_on = [var.bucket]
  for_each   = toset([for file in fileset("${var.dist_dir}", "**/*") : file if !(startswith(file, "ssg") || file == "rewrites.json")])
  bucket = var.bucket.id
  key    = each.value
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
  acl    = "public-read"
  source = "${var.dist_dir}/${each.value}"

}

resource "aws_s3_bucket_website_configuration" "interface_config" {
  provider = aws.target
  bucket   = var.bucket.id

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

output "s3_website_url" {
  value = var.bucket.website_endpoint
}