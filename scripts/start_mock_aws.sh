#!/bin/bash

# Change to the scripts directory
cd "$(dirname "$0")" || exit

# Change to the terraform directory
cd ../terraform/main || exit

# Set mock AWS credentials
export AWS_ACCESS_KEY_ID="mock_access_key"
export AWS_SECRET_ACCESS_KEY="mock_secret_key"

# Set the AWS server endpoint
export AWS_ENDPOINT_URL="http://localhost:5000"

start_moto_server() {
  # Start the moto3 server
  echo "Starting moto3 server..."
  moto_server > /dev/null 2>&1 &

  # Get the process ID of the moto3 server
  MOTO_PID=$!

  # Wait for the server to start
  sleep 15

  # Check if the server started successfully
  if ps -p $MOTO_PID > /dev/null; then
    echo "moto3 server started successfully with PID $MOTO_PID"
  else
    echo "Failed to start moto3 server"
    exit 1
  fi
}
init_terraform() {
  # Check if .terraform directory exists
  if [ ! -d ".terraform" ]; then
    echo "Initializing Terraform..."
    terraform init
  else
    echo "Terraform already initialized."
  fi
}

run_terraform() {
  # Execute terraform plan
  terraform plan

  # Prompt for user input
  read -rp "Do you want to apply the terraform plan? (y/n): " user_input

  if [ "$user_input" == "y" ]; then
    terraform apply --auto-approve
  else
    echo "Killing moto3 server with PID $MOTO_PID"
    kill $MOTO_PID
    exit 1
  fi
}

# Run terraform
start_moto_server 
init_terraform
run_terraform

# Check if the moto3 server is still running
if ps -p $MOTO_PID > /dev/null; then
  echo "moto3 server is still running with PID $MOTO_PID"
  wait $MOTO_PID
else
  echo "moto3 server has stopped unexpectedly"
fi