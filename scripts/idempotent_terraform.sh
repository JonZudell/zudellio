#!/bin/bash
cd "$(dirname "$0")" || exit

cd ../terraform/main || exit

terraform init

# Apply Terraform configuration
terraform apply