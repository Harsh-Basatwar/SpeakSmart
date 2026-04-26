#!/bin/bash
set -e

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  yum update -y
  yum install -y docker
  systemctl enable docker
  systemctl start docker
  usermod -aG docker ec2-user
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
  echo "Installing Docker Compose..."
  curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
    -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

# Install AWS CLI if not installed (needed to pull SSM params and ECR login)
if ! command -v aws &> /dev/null; then
  echo "Installing AWS CLI..."
  yum install -y awscli
fi

echo "BeforeInstall complete"
