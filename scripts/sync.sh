#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
# This script runs the npm build command in the interface directory
# Check for --no-build flag
NO_BUILD=false
TAG_PROVIDED=false
for arg in "$@"; do
  if [ "$arg" == "--no-build" ]; then
    NO_BUILD=true
  else
    TAG_PROVIDED=true
    TAG_ARG="$arg"
  fi
done

# Navigate to the interface directory
cd ../ || exit
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

# Check if a tag is provided

if [ "$TAG_PROVIDED" = true ]; then
  echo "$TAG_ARG provided"
  tag="$TAG_ARG"
elif [ "$NO_BUILD" = true ]; then
  echo "NO_BUILD and NO_TAG Latest manifest used"
  latest_manifest=$(ls -t ./manifests | head -n 1)
  tag=$(echo "$latest_manifest" | cut -d'_' -f1)
else
  echo "No tag provided in build mode, generating new tag"
  tag=$(date +%Y%m%d%H%M%S)-$(git rev-parse --short=8 HEAD)
fi

if [ "$NO_BUILD" = false ]; then
  echo "Building..."
  ./scripts/build.sh "$tag"
fi

./scripts/idempotent_terraform.sh "$tag"
./scripts/clean_manifests.sh "$tag"