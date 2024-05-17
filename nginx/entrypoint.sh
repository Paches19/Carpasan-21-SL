#!/bin/bash

# Esperar a que los certificados estén disponibles
while [ ! -f /etc/letsencrypt/live/carpasan21.com/fullchain.pem ]; do
  echo "Esperando certificados..."
  sleep 2
done

# Iniciar Nginx
nginx -g "daemon off;"