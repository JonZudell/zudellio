#!/bin/bash -e

# Check if INFRASTRUCTURE_PROFILE is set
if [ -z "$INFRASTRUCTURE_PROFILE" ]; then
  echo "Error: INFRASTRUCTURE_PROFILE is not set."
  exit 1
fi

# Check if the tag argument is provided
if [ -z "$1" ]; then
  echo "Error: No tag provided."
  exit 1
fi

TAG=$1
CONTAINERS_MANIFEST="./manifests/${TAG}_containers.json"
LAMBDA_MANIFEST="./manifests/${TAG}_lambdas.json"

# Verify the existence of the manifest files
if [ ! -f "$CONTAINERS_MANIFEST" ]; then
  echo "Error: Containers manifest file not found: $CONTAINERS_MANIFEST"
  exit 1
fi

if [ ! -f "$LAMBDA_MANIFEST" ]; then
  echo "Error: Lambda manifest file not found: $LAMBDA_MANIFEST"
  exit 1
fi

# Function to check if an ECR repository exists
function check_ecr_exists {
  local repo_name=$1

  aws ecr describe-repositories --profile $INFRASTRUCTURE_PROFILE --repository-names "$repo_name" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "ECR repository not found: $repo_name. Creating it..."
    aws ecr create-repository --profile $INFRASTRUCTURE_PROFILE --repository-name "$repo_name"
    if [ $? -eq 0 ]; then
      echo "ECR repository created: $repo_name"
    else
      echo "Failed to create ECR repository: $repo_name"
      return 1
    fi
  else
    echo "ECR repository exists: $repo_name"
    return 0
  fi
}

# Read container names from the containers manifest
container_names=$(jq -r '.containers[]?.name' "$CONTAINERS_MANIFEST")

# Read lambda names from the lambda manifest
lambda_names=$(jq -r '.lambdas[]?.name' "$LAMBDA_MANIFEST")

# Check ECR repositories for containers
for container in $container_names; do
  check_ecr_exists "$container"
done

# Check ECR repositories for lambdas
for lambda in $lambda_names; do
  check_ecr_exists "$lambda"
done

echo "ECR check completed."