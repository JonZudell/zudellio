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

variable "commit_hash" {
  description = "The commit hash"
  type        = string
}

variable "lambda_exec" {

}

variable "manifests_dir" {
  description = "The directory containing manifest files"
  type        = string
}
locals {
  lambda_manifests = {
    for key, value in jsondecode(file("${var.manifests_dir}/${[for file in fileset(var.manifests_dir, "*.json") : file if startswith(file, "flattened_manifest")][0]}")) : key => value
    if value.type == "lambda"
  }

  trimmed_lambda_name = replace(var.lambda_name, "zudellio_", "")
}
resource "null_resource" "docker_login" {
  provisioner "local-exec" {
    command = <<EOT
      set -e
      aws ecr get-login-password | docker login --username AWS --password-stdin ${var.repository.repository_url}
    EOT
  }
}

resource "null_resource" "docker_build" {
  lifecycle {
    create_before_destroy = true
  }
  triggers = {
    commit_hash = var.commit_hash
  }
  depends_on = [null_resource.docker_login]
  provisioner "local-exec" {
    command = <<EOT
      set -e
      docker tag ${local.trimmed_lambda_name}:${var.commit_hash} ${var.repository.repository_url}:${var.commit_hash}
      docker push ${var.repository.repository_url}:${var.commit_hash}
    EOT
  }
}

resource "aws_lambda_function" "lambda" {
  depends_on    = [null_resource.docker_build]
  provider      = aws.target
  function_name = var.lambda_name
  role          = var.lambda_exec.arn
  package_type  = "Image"
  timeout       = 15

  image_uri = "${var.repository.repository_url}:${var.commit_hash}"
}