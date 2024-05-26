#!/bin/bash

# Load environment variables
source .env

# Create a JSON string from the AMPLIFY_CONFIG environment variable
json_string="{ \"AMPLIFY_CONFIG\": \"$AMPLIFY_CONFIG\" }"

# Convert the JSON string to base64
base64_string=$(echo -n "$json_string" | base64)

# Write the base64 string to a file
echo "$base64_string" > "src/configs/amplify/amplify-$FLAVOR.json"