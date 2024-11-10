#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")"
# This script runs the npm build command in the interface directory

# Navigate to the interface directory
cd ../interface

# Run npm build
npm run build