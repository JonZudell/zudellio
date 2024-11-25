#!/bin/bash

# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
cd ../ || exit

# Create reports directory if it doesn't exist
mkdir -p ./reports

echo "Running Checkov..."
checkov -d . --output sarif > ./reports/checkov_report.sarif

echo "Running TFLint..."
tflint --init
tflint --format sarif > ./reports/tflint_report.sarif

echo "Running Terrascan..."
terrascan scan -o sarif > ./reports/terrascan_report.sarif

echo "Running OpenTofu..."
opentofu validate -json > ./reports/opentofu_report.sarif

echo "Running Deno lint..."
deno lint --json > ./reports/deno_lint_report.sarif

echo "Running Prettier..."
prettier --check . > ./reports/prettier_report.sarif

echo "Running Semgrep..."
semgrep --config auto --sarif > ./reports/semgrep_report.sarif

echo "Running OSV-Scanner..."
osv-scanner --sarif > ./reports/osv_scanner_report.sarif

echo "SCA reports generated in ./reports directory."