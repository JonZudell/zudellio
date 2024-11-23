#!/bin/bash
cd "$(dirname "$0")" || exit

cd ../terraform/main || exit
# Validate Terraform configuration
terraform validate || exit 1

# Format Terraform configuration files
terraform fmt -recursive
terraform init

# Apply Terraform configuration
terraform apply