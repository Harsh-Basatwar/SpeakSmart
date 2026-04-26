#!/bin/bash
set -e

APP_DIR=/home/ec2-user/speaksmart
REGION=ap-south-1

echo "Fetching secrets from SSM Parameter Store..."

# Pull all secrets from SSM and write to .env file
aws ssm get-parameters \
  --names \
    "/speaksmart/JWT_SECRET" \
    "/speaksmart/DB_HOST" \
    "/speaksmart/DB_USER" \
    "/speaksmart/DB_PASSWORD" \
    "/speaksmart/GOOGLE_GENERATIVE_AI_KEY" \
    "/speaksmart/CLIENT_URL" \
  --with-decryption \
  --region $REGION \
  --query "Parameters[*].[Name,Value]" \
  --output text | while IFS=$'\t' read -r name value; do
    key=$(basename "$name")
    echo "$key=$value" >> $APP_DIR/.env
  done

# Add non-secret env vars
cat >> $APP_DIR/.env <<EOF
NODE_ENV=production
PORT=5000
DB_PORT=3306
DB_NAME=english_learning_platform
EOF

# Get ECR image URI from docker-compose.yml (already baked in by buildspec)
ECR_IMAGE=$(grep 'image:' $APP_DIR/docker-compose.yml | awk '{print $2}')
echo "ECR_IMAGE=$ECR_IMAGE" >> $APP_DIR/.env

# Login to ECR and pull the image
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

echo "Pulling Docker image: $ECR_IMAGE"
docker pull $ECR_IMAGE

# Set correct ownership
chown -R ec2-user:ec2-user $APP_DIR

echo "AfterInstall complete"
