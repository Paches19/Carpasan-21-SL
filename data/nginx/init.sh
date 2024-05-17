#!/bin/bash

# Espera a que Nginx esté listo
sleep 10

# Obtén los certificados SSL
certbot certonly --webroot --webroot-path=/var/www/certbot -d carpasan21.com -d www.carpasan21.com --non-interactive --agree-tos -m carpasan21sl@gmail.com

# Copia la configuración SSL de Nginx
cp /etc/nginx/nginxFinal.conf /etc/nginx/nginx.conf

# Reinicia Nginx con la configuración SSL
nginx -s reload
