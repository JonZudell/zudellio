#!/bin/bash
cd "$(dirname "$0")" || exit

cd ../terraform/main || exit

if [ ! -d ".terraform" ]; then
  terraform init
fi

# Apply Terraform configuration
terraform apply