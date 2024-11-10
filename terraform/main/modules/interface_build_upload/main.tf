variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "interface_dir" {
  description = "The path to the interface directory"
  type        = string
}

resource "null_resource" "build_interface" {
  provisioner "local-exec" {
    command = "cd ${var.interface_dir} && npm run build"
  }
}

resource "aws_s3_bucket" "interface_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_object" "interface_files" {
  depends_on = [null_resource.build_interface, aws_s3_bucket.interface_bucket]
  for_each = toset([for file in fileset("${var.interface_dir}/dist", "**/*") : file if !(startswith(file, "ssg") || file == "rewrites.json")])

  bucket = aws_s3_bucket.interface_bucket.id
  key    = each.value
  source = "${var.interface_dir}/dist/${each.value}"
}

resource "aws_s3_bucket_website_configuration" "interface_config" {
  bucket = aws_s3_bucket.interface_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
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

output "bucket_name" {
  description = "The ID of the S3 bucket"
  value       = var.bucket_name
}