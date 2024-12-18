#!/bin/bash
manifest_file=$1
commit_hash=$2
start_dir=$(pwd)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 585768141523.dkr.ecr.us-east-1.amazonaws.com
for key in $(jq -r 'keys[]' "$manifest_file"); do
  type=$(jq -r --arg key "$key" '.[$key].type' "$manifest_file")
  if [ "$type" == "lambda" ] || [ "$type" == "container" ]; then
    dockerfile=$(jq -r --arg key "$key" '.[$key].Dockerfile' "$manifest_file")
    #cd "$(dirname "$dockerfile")" || exit
    echo "docker build -t 585768141523.dkr.ecr.us-east-1.amazonaws.com/$key:$commit_hash -f $dockerfile $(dirname $dockerfile)"
    cp "dist/$commit_hash/rewrites.json" "$(dirname "$dockerfile")"
    docker build -t 585768141523.dkr.ecr.us-east-1.amazonaws.com/$key:$commit_hash -f $dockerfile $(dirname $dockerfile)
    repository_exists=$(aws ecr describe-repositories --repository-names "$key" --region us-east-1 2>&1)
    docker push 585768141523.dkr.ecr.us-east-1.amazonaws.com/$key:$commit_hash
    cd "$start_dir" || exit

  fi
done