#!/bin/bash

# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
cd ../ || exit

# Create reports directory if it doesn't exist
mkdir -p ./reports

# Run Checkov
checkov -d . --output sarif > ./reports/checkov_report.sarif

# Run TFLint
tflint --init
tflint --format sarif > ./reports/tflint_report.sarif

# Run Terrascan
terrascan scan -o sarif > ./reports/terrascan_report.sarif

# Run OpenTofu
opentofu validate -json > ./reports/opentofu_report.sarif

# Run Deno lint
deno lint --json > ./reports/deno_lint_report.sarif

# Run ESLint
eslint . -f sarif -o ./reports/eslint_report.sarif

# Run Prettier
prettier --check . > ./reports/prettier_report.sarif

# Run Semgrep
semgrep --config auto --sarif > ./reports/semgrep_report.sarif

# Run OSV-Scanner
osv-scanner --sarif > ./reports/osv_scanner_report.sarif

echo "SCA reports generated in ./reports directory."