#!/bin/bash
cd "$(dirname "$0")" || exit

cd ../terraform/main || exit
# Validate Terraform configuration
echo "Initializing Terraform configuration..."
terraform init
echo "Validating Terraform configuration..."
terraform validate || exit 1

# Format Terraform configuration files
echo "Formatting Terraform configuration..."
terraform fmt -recursive
commit_hash=$(git rev-parse --short=8 HEAD)
export TF_VAR_image_tag="$1"
# Apply Terraform configuration
echo "Applying Terraform configuration..."
terraform apply