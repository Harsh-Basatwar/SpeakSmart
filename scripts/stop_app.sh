#!/bin/bash
set -e

APP_DIR=/home/ec2-user/speaksmart

echo "Stopping application..."

if [ -f "$APP_DIR/docker-compose.yml" ]; then
  cd $APP_DIR
  docker-compose down --timeout 30 || true
fi

# Clean up old unused images to save disk space
docker image prune -f || true

echo "ApplicationStop complete"
