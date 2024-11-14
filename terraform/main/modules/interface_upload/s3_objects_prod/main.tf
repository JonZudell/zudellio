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

variable "interface_dir" {
  type        = string
}

variable "bucket" {
  description = "The S3 bucket"
}

resource "aws_s3_object" "interface_files_prod" {
  provider = aws.target
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [var.bucket]
  for_each = toset([for file in fileset("${var.interface_dir}/dist", "**/*") : file if !(startswith(file, "ssg") || file == "rewrites.json")])

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
  acl="public-read"
  source = "${var.interface_dir}/dist/${each.value}"
  
}