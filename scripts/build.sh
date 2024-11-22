#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
# This script runs the npm build command in the interface directory

# Navigate to the interface directory
cd ../interface || exit
# Get the latest commit hash
commit_hash=$(git rev-parse --short=8 HEAD)
npm run build
mkdir -p ../dist/$commit_hash/
cp -r  ./dist/ ../dist/$commit_hash/

cd ../ || exit



python ./scripts/generate_lambda_manifest.py "$commit_hash"
python ./scripts/merge_manifest_rewrites.py "$commit_hash"
python ./scripts/flatten_manifest.py "$commit_hash"

./scripts/build_lambda_images.sh ./manifests/flattened_manifest_"$commit_hash".json "$commit_hash"
echo "Latest commit hash: $commit_hash"