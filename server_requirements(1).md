# DMS Server Setup Requirements

## Recommended Operating System
Ubuntu Server 22.04 LTS (Recommended for stability and long-term support)

## Minimum Hardware Requirements
- CPU: 4 cores
- RAM: 16GB
- Storage: 512GB SSD (or more depending on document volume)
- Network: 1Gbps

## Required Software Packages and Dependencies

### Basic System Packages
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y \
    build-essential \
    curl \
    wget \
    git \
    nginx \
    certbot \
    python3-certbot-nginx \
    supervisor \
    ufw \
    fail2ban