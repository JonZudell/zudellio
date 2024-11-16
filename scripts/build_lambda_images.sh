#!/bin/bash
manifest_file=$1
commit_hash=$2
start_dir=$(pwd)
for key in $(jq -r 'keys[]' "$manifest_file"); do
  type=$(jq -r --arg key "$key" '.[$key].type' "$manifest_file")
  if [ "$type" == "lambda" ]; then
    dockerfile=$(jq -r --arg key "$key" '.[$key].Dockerfile' "$manifest_file")
    cd "$(dirname "$dockerfile")" || exit
    echo "docker build -t $key:$commit_hash -f $dockerfile ."
    docker build -t "$key":"$commit_hash" -f "$dockerfile" .
    cd "$start_dir" || exit
  fi
done