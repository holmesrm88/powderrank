#!/bin/bash
# PowderRank EC2 Setup Script
# Run on a fresh Amazon Linux 2023 or Ubuntu 22.04 instance
#
# Usage:
#   1. Launch an EC2 instance (t3.small recommended, 2GB+ RAM)
#      - Amazon Linux 2023 or Ubuntu 22.04
#      - Security group: allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
#   2. SSH in and run: curl -fsSL <raw-github-url>/deploy/setup-ec2.sh | bash
#      Or clone the repo and run: bash deploy/setup-ec2.sh

set -euo pipefail

echo "=== PowderRank EC2 Setup ==="

# Detect OS
if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS=$ID
else
  echo "Unsupported OS"
  exit 1
fi

# Install Docker
if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  if [ "$OS" = "amzn" ]; then
    sudo dnf update -y
    sudo dnf install -y docker
    sudo systemctl enable --now docker
  elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo systemctl enable --now docker
  fi
  sudo usermod -aG docker "$USER"
  echo "Docker installed. You may need to log out and back in for group changes."
fi

# Install Docker Compose plugin (Amazon Linux)
if [ "$OS" = "amzn" ] && ! docker compose version &>/dev/null; then
  echo "Installing Docker Compose plugin..."
  sudo mkdir -p /usr/local/lib/docker/cli-plugins
  COMPOSE_VERSION=$(curl -fsSL https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
  sudo curl -fsSL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-$(uname -m)" -o /usr/local/lib/docker/cli-plugins/docker-compose
  sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi

# Set up app directory
APP_DIR=/opt/powderrank
if [ ! -d "$APP_DIR" ]; then
  echo "Setting up application directory..."
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER:$USER" "$APP_DIR"
fi

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Clone your repo into $APP_DIR:"
echo "     cd $APP_DIR && git clone <your-repo-url> ."
echo ""
echo "  2. Start the app:"
echo "     cd $APP_DIR && docker compose up -d"
echo ""
echo "  3. Check logs:"
echo "     docker compose logs -f app"
echo ""
echo "  4. The app will be available at http://<your-ec2-public-ip>:3003"
echo "     (Background pre-fetch will take ~44 min on first startup)"
