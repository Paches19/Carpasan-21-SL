#!/bin/bash

# Iniciar Nginx
nginx &

# Espera a que Nginx esté listo
sleep 10

# Obtén los certificados SSL
certbot certonly --webroot --webroot-path=/var/www/certbot -d carpasan21.com -d www.carpasan21.com --non-interactive --agree-tos -m carpasan21sl@gmail.com || true

# Genera ssl-dhparams.pem si no existe o está vacío
if [ ! -s /etc/letsencrypt/ssl-dhparams.pem ]; then
openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Verifica si los certificados existen
if [ -f /etc/letsencrypt/live/carpasan21.com/fullchain.pem ] && [ -f /etc/letsencrypt/live/carpasan21.com/privkey.pem ]; then
  # Copia la configuración SSL de Nginx
  cp /etc/nginx/nginx-ssl.conf /etc/nginx/nginx.conf

  # Recarga Nginx con la configuración SSL
  nginx -s reload
else
  echo "Certificados SSL no encontrados. Asegúrate de que Certbot ha generado los certificados correctamente."
  exit 1
fi

# Mantener el contenedor en ejecución
tail -f /var/log/nginx/access.log /var/log/nginx/error.log
