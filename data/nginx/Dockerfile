# Etapa de NGINX para servir los archivos
FROM nginx:stable

RUN mkdir -p /var/www/certbot
RUN mkdir -p data/nginx
RUN mkdir -p data/certbot/www
RUN mkdir -p data/certbot/conf


RUN apt-get update && \
    apt-get install -y certbot python3-certbot-nginx && \
    apt-get clean

# Configurar NGINX
COPY ./data/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./data/nginx/options-ssl-nginx.conf /etc/letsencrypt/options-ssl-nginx.conf

COPY ./web /usr/share/nginx/html/static

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]