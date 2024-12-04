#!/bin/bash
# Navigate to the scripts directory
cd "$(dirname "$0")" || exit
# This script runs the npm build command in the interface directory

# Navigate to the interface directory
cd ../interface || exit
# Run Storybook in the background and output to ../background_process_output with file name ./interface_dev_${pid}
nohup npm run storybook > ../background_process_output/interface_dev_$$.log 2>&1 &