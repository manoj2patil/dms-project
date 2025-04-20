#!/bin/bash

# Certbot auto-renewal script
certbot renew --quiet --no-self-upgrade

# Reload Nginx after renewal
systemctl reload nginx

# Log the renewal
echo "Certificate renewal attempted on $(date)" >> /var/log/cert-renewal.log