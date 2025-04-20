# Test SSL configuration
openssl s_client -connect yourdomain.com:443 -tls1_2

# Test SSL certificate
openssl x509 -in /path/to/certificate.crt -text -noout