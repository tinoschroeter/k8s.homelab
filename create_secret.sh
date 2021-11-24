#!/bin/bash

if [ ! -z "$1" ]; then
  cat <<EOF | kubectl apply -f -
  apiVersion: v1
  kind: Secret
  metadata:
    name: api-uptimerobot 
  type: Opaque
  data:
    API: $(echo -n $1 | base64 -w0)
EOF

else 
  echo "Password missing..."
fi
