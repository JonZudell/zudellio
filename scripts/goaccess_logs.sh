#!/bin/bash

# Variables
BUCKET_NAME=$1
LOGS_DIR="/tmp/logs/"
CONCATENATED_LOG="all_logs.log"

# Create logs directory if it doesn't exist
mkdir -p $LOGS_DIR
# Clear logs directory if it exists
rm -rf $LOGS_DIR/*
# Download logs from S3 bucket
aws s3 sync s3://$BUCKET_NAME $LOGS_DIR

# Uncompress all .gz files
gunzip $LOGS_DIR/production/*.gz

cat /tmp/logs/production/* | goaccess --log-format=CLOUDFRONT