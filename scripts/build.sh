#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
# This script runs the npm build command in the interface directory

# Navigate to the interface directory
cd ../interface || exit

# Check if files in interface src have been updated more recently than files in interface dist
if [ "$(find src -type f -newer dist -print -quit)" ]; then
  echo "Source files have been updated more recently than dist files. Running npm build."
  npm run build
else
  echo "No updates in source files. Skipping npm build."
fi

cd ../ || exit

# Get the latest commit hash
commit_hash=$(git rev-parse --short=8 HEAD)
echo "Latest commit hash: $commit_hash"

python ./scripts/generate_lambda_manifest.py "$commit_hash"
python ./scripts/merge_manifest_rewrites.py "$commit_hash"
python ./scripts/flatten_manifest.py "$commit_hash"

./scripts/build_lambda_images.sh ./manifests/flattened_manifest_"$commit_hash".json "$commit_hash"

cd terraform/main || exit

# Initialize Terraform if not already initialized
if [ ! -d ".terraform" ]; then
  terraform init
fi

# Apply Terraform configuration
terraform apply