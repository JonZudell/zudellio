#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
# This script runs the npm build command in the interface directory

# Navigate to the interface directory
cd ../interface || exit
# Check if SSO credentials are up to date
if ! aws sts get-caller-identity > /dev/null 2>&1; then
  echo "AWS SSO credentials are not up to date. Please refresh your SSO session and try again."
  exit 1
fi

# Check if AWS profile is set
if [ -z "$AWS_PROFILE" ]; then
  echo "AWS_PROFILE is not set. Please set your AWS_PROFILE environment variable and try again."
  exit 1
fi

# Get the latest commit hash
# Check if Docker engine is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker engine is not running. Please start Docker and try again."
  exit 1
fi

# Check if python is available, otherwise use python3
if command -v python &>/dev/null; then
  PYTHON_CMD=python
elif command -v python3 &>/dev/null; then
  PYTHON_CMD=python3
else
  echo "Python is not installed. Please install Python and try again."
  exit 1
fi

# Get the latest commit hash
commit_hash=$(git rev-parse --short=8 HEAD)
npm run build
./scripts/process_dist.sh "$commit_hash"

# cd ../ || exit

# $PYTHON_CMD ./scripts/generate_lambda_manifest.py "$commit_hash"
# $PYTHON_CMD ./scripts/merge_manifest_rewrites.py "$commit_hash"
# $PYTHON_CMD ./scripts/flatten_manifest.py "$commit_hash"

# ./scripts/build_lambda_images.sh ./manifests/"$commit_hash".json "$commit_hash"
echo "Latest commit hash: $commit_hash"