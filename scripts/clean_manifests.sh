#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
cd ../
tag="$1"

# Read production_image_tag from terraform.tfvars
production_image_tag=$(grep 'production_image_tag' ./terraform/main/terraform.tfvars | cut -d '=' -f2 | tr -d ' "')
echo "Production Image Tag: $production_image_tag"
# Check if the tag or production_image_tag is in the file name
for file in ./manifests/*; do
echo
  if [[ ! "$file" == *"$tag"* ]] && [[ ! "$file" == *"$production_image_tag"* ]]; then
    rm $file
  else
    echo "$file is active manifest"
  fi
done