# Etapa de construcción de la aplicación React
FROM node:14-alpine as react-builder
WORKDIR /app
COPY ./order-app/package.json ./order-app/package-lock.json* ./
RUN npm install --production
COPY ./order-app/ .
RUN npm run build

# Etapa de NGINX para servir los archivos
FROM nginx:alpine
# Configurar NGINX
COPY ./nginx-react/nginx.conf /etc/nginx/nginx.conf
# Copiar los archivos construidos de React desde la etapa de construcción
COPY --from=react-builder /app/build /usr/share/nginx/html/react

EXPOSE 2080
CMD ["nginx", "-g", "daemon off;" , "-p", "2080"]