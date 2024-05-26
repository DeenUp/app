#!/bin/bash

# Load environment variables
source .env

# Decode the AMPLIFY_CONFIG environment variable from base64 to JSON
json_decoded=$(echo -n "$AMPLIFY_CONFIG" | base64 --decode)


# Write the decoded JSON string to a file
echo "$json_decoded" > "../src/configs/amplify/amplify-$FLAVOR.json"