#!/bin/bash
set -e

APP_DIR=/home/ec2-user/speaksmart

echo "Starting application..."

cd $APP_DIR
docker-compose --env-file .env up -d

echo "ApplicationStart complete"
