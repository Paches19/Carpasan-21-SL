# data/nginx/Dockerfile
FROM nginx:stable

RUN mkdir -p /var/www/certbot

# Copiamos Certbot
RUN apt-get update && apt-get install -y certbot python3-certbot-nginx && apt-get clean

# Generar el archivo ssl-dhparams.pem
RUN openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048

# Copiamos la configuración inicial de Nginx
COPY /data/nginx/nginx.conf /etc/nginx/nginx.conf
COPY /data/nginx/nginx-ssl.conf /etc/nginx/nginx-ssl.conf
COPY /data/nginx/options-ssl-nginx.conf /etc/letsencrypt/options-ssl-nginx.conf
COPY /data/nginx/init.sh /init.sh
RUN chmod +x /init.sh

COPY ./web /usr/share/nginx/html/static

EXPOSE 80 443

CMD ["/bin/bash", "-c", "/init.sh"]
