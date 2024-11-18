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

variable "lambda_name" {
  type = string
}

variable "infrastructure_profile" {
  description = "The infrastructure profile (e.g., dev, prod)"
  type        = string
}

variable "repository" {
}

variable "image_tag" {
  description = "The commit hash"
  type        = string
}

variable "lambda_exec" {

}

variable "manifest_file" {
  description = "The directory containing manifest files"
  type        = string
}
locals {
  lambda_manifests = {
    for key, value in jsondecode(file("${var.manifest_file}")) : key => value
    if value.type == "lambda"
  }

  trimmed_lambda_name = replace(var.lambda_name, "zudellio_", "")
}

# resource "aws_lambda_function" "lambda" {
#   provider      = aws.target
#   function_name = var.lambda_name
#   role          = var.lambda_exec.arn
#   package_type  = "Image"
#   timeout       = 15

#   image_uri = "${var.repository.repository_url}:${var.image_tag}"
# }