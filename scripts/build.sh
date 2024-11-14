#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
# This script runs the npm build command in the interface directory

# Navigate to the interface directory
cd ../interface || exit

# Run npm build
npm run build

cd ../interface/main || exit

# Initialize Terraform if not already initialized
if [ ! -d ".terraform" ]; then
  terraform init
fi

# Apply Terraform configuration
terraform apply -auto-approve