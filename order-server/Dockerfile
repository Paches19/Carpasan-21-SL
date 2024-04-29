# Usar una imagen base de Node.js
FROM node:14-alpine

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto que el servidor Node.js utilizará
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]