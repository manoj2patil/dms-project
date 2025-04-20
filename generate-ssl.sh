# Generate SSL certificate
certbot certonly --nginx -d yourdomain.com

# Set up auto-renewal
echo "0 0,12 * * * /path/to/ssl-renewal.sh" | crontab -