#!/bin/bash
aws secretsmanager get-secret-value --secret-id $C2_SECRETS --query 'SecretString' --output text | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' > /tmp/c2_secrets.env
source /tmp/c2_secrets.env
./c2-3.4.0_amd64_linux  -reverseProxy -recoverAccount $C2_USERNAME -setPass $C2_PSSWORD -setLicenseKey $C2_LICENSE
