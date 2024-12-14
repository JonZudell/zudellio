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

variable "persistence_manifest_file" {
  description = "The manifest"
}

locals {
  persistence_manifest = jsondecode(file(var.persistence_manifest_file))
}

resource "aws_dynamodb_table" "dynamodb_tables" {
  for_each = local.persistence_manifest

  name           = each.key
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "uuid"

  dynamic "attribute" {
    for_each = each.value.attributes
    content {
      name = attribute.key
      type = "S"
    }
  }
}