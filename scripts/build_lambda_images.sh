#!/bin/bash
manifest_file=$1

for key in $(jq -r 'keys[]' $manifest_file); do
  type=$(jq -r --arg key "$key" '.[$key].type' $manifest_file)
  if [ "$type" == "lambda" ]; then
    dockerfile=$(jq -r --arg key "$key" '.[$key].Dockerfile' $manifest_file)
    docker build -t "$key" -f "$dockerfile" "$(dirname "$dockerfile")"
  fi
done