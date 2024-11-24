#!/bin/bash
manifest_file=$1
commit_hash=$2
start_dir=$(pwd)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 585768141523.dkr.ecr.us-east-1.amazonaws.com
for key in $(jq -r 'keys[]' "$manifest_file"); do
  type=$(jq -r --arg key "$key" '.[$key].type' "$manifest_file")
  if [ "$type" == "lambda" ]; then
    dockerfile=$(jq -r --arg key "$key" '.[$key].Dockerfile' "$manifest_file")
    cd "$(dirname "$dockerfile")" || exit
    echo "docker build -t 585768141523.dkr.ecr.us-east-1.amazonaws.com/$key:$commit_hash -f $dockerfile ."
    docker build --build-arg COMMIT_HASH="$commit_hash" -t "585768141523.dkr.ecr.us-east-1.amazonaws.com/$key":"$commit_hash" -f "$dockerfile" .
    repository_exists=$(aws ecr describe-repositories --repository-names "$key" --region us-east-1 2>&1)
    if echo "$repository_exists" | grep -q "RepositoryNotFoundException"; then
      aws ecr create-repository --repository-name "$key" --region us-east-1
    fi
    docker push 585768141523.dkr.ecr.us-east-1.amazonaws.com/$key":"$commit_hash
    cd "$start_dir" || exit
  fi
done