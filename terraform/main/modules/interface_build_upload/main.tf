variable "interface_dir" {
  type        = string
}

variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

resource "null_resource" "build_interface" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = "cd ${var.interface_dir} && npm run build"
  }
}

resource "aws_s3_bucket" "interface_bucket" {
  bucket = var.bucket_name 
}

resource "aws_s3_bucket_public_access_block" "interface_bucket_public_access_block" {
  bucket = aws_s3_bucket.interface_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "interface_bucket_ownership_controls" {
  bucket = aws_s3_bucket.interface_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "interface_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.interface_bucket_ownership_controls]

  bucket = aws_s3_bucket.interface_bucket.id
  acl    = "public-read"
}

resource "aws_s3_object" "interface_files" {
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [null_resource.build_interface, aws_s3_bucket.interface_bucket]
  for_each = toset([for file in fileset("${var.interface_dir}/dist", "**/*") : file if !(startswith(file, "ssg") || file == "rewrites.json")])

  bucket = aws_s3_bucket.interface_bucket.id
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
  #content_type   = "text/html"
  acl="public-read"
  source = "${var.interface_dir}/dist/${each.value}"
}

resource "aws_s3_bucket_website_configuration" "interface_config" {
  bucket = aws_s3_bucket.interface_bucket.id

  index_document {
    suffix = "index.html"
  }
  
  dynamic "routing_rule" {
    for_each = jsondecode(file("${var.interface_dir}/dist/rewrites.json")).rewrites

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

output "bucket" {
  description = "The ID of the S3 bucket"
  value       = aws_s3_bucket.interface_bucket
}