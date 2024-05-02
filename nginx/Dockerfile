# Etapa de NGINX para servir los archivos
FROM nginx:alpine
# Configurar NGINX
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# Copiar los archivos estáticos de la web
COPY ./web /usr/share/nginx/html/static

EXPOSE 80
CMD ["nginx", "-g", "daemon off;" , "-p", "80"]