# Allow HTTPS traffic
ufw allow 443/tcp

# Allow HTTP for redirect
ufw allow 80/tcp

# Enable firewall
ufw enable