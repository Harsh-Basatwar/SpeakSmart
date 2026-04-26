#!/bin/bash
set -e
set -x

echo "Starting BeforeInstall..."

# Install Docker
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  dnf update -y
  dnf install -y docker
  systemctl enable docker
  systemctl start docker
  usermod -aG docker ec2-user
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
  echo "Installing Docker Compose..."
  curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
    -o /usr/local/bin/docker-compose

  chmod +x /usr/local/bin/docker-compose

  # 🔥 IMPORTANT FIX (make it globally accessible)
  ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
fi

# Install AWS CLI
if ! command -v aws &> /dev/null; then
  echo "Installing AWS CLI..."
  dnf install -y awscli
fi

echo "Docker version:"
docker --version

echo "Docker Compose version:"
docker-compose --version

echo "BeforeInstall complete"