#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit

# Define the lambdas directory
LAMBDAS_DIR="../lambdas"
MANIFESTS_DIR="../manifests"
# Function to generate JSON for directory structure
generate_json() {
  local dir=$1
  local indent=$2
  echo "{"
  local first=true
  for file in "$dir"/*; do
    if [ "$(basename "$file")" = "__pycache__" ]; then
      continue
    fi
    if [ -d "$file" ]; then
      if [ "$first" = true ]; then
        first=false
      else
        echo ","
      fi
      local name=$(basename "$file")
      echo -n "$indent\"$name\": "
      generate_json "$file" "$indent  "
    fi
  done
  echo
  echo -n "$indent}"
}
# Get the current timestamp
timestamp=$(date +"%Y%m%d%H%M%S")

# Generate the JSON and save to manifest with timestamp
generate_json "$LAMBDAS_DIR" "  " | python -m json.tool > "$MANIFESTS_DIR/manifest_$timestamp.json"