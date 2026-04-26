#!/bin/bash
set -e

echo "Validating service..."

RETRIES=10
WAIT=5

for i in $(seq 1 $RETRIES); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || true)
  if [ "$STATUS" = "200" ]; then
    echo "Health check passed (attempt $i)"
    exit 0
  fi
  echo "Attempt $i/$RETRIES failed (HTTP $STATUS), retrying in ${WAIT}s..."
  sleep $WAIT
done

echo "Health check failed after $RETRIES attempts"
exit 1
