# data/nginx/Dockerfile
FROM nginx:stable

RUN mkdir -p /var/www/certbot

# Copiamos Certbot
RUN apt-get update && apt-get install -y certbot python3-certbot-nginx && apt-get clean

# Copiamos la configuración inicial de Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./options-ssl-nginx.conf /etc/letsencrypt/options-ssl-nginx.conf

COPY ./web /usr/share/nginx/html/static

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
