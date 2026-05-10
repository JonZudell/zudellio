#!/bin/bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <bucket_name> [spaces_region]"
  exit 1
fi

bucket_name="$1"
spaces_region="${2:-nyc3}"

if [ -z "${DIGITALOCEAN_TOKEN:-}" ]; then
  echo "DIGITALOCEAN_TOKEN must be set"
  exit 1
fi

start_dir="$(pwd)"
cd "$(dirname "$0")/../terraform/digitalocean-bootstrap"

echo "Initializing bootstrap Terraform..."
terraform init

echo "Trying to import existing Spaces bucket (safe to ignore if not present)..."
terraform import "digitalocean_spaces_bucket.terraform_state" "${spaces_region},${bucket_name}" >/dev/null 2>&1 || true

echo "Applying bootstrap stack..."
terraform apply -auto-approve \
  -var "bucket_name=${bucket_name}" \
  -var "spaces_region=${spaces_region}"

echo "\nBootstrap outputs:\n"
echo "DO_STATE_BUCKET=$(terraform output -raw state_bucket_name)"
echo "DO_STATE_REGION=$(terraform output -raw state_backend_region)"
echo "DO_STATE_ENDPOINT=$(terraform output -raw state_backend_endpoint)"

cd "$start_dir"
