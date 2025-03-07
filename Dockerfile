# Stage 1: Build the Angular app
FROM node:20.13-alpine AS build

WORKDIR /app

# Configurar registro npm (si es necesario)
RUN npm set registry https://registry.npmjs.org/

COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto de los archivos
COPY . ./

# Ajustar configuraciones según entorno
RUN rm ./proxy.conf.json
COPY proxy.conf-prod.json ./proxy.conf.json

# Build con optimizaciones
RUN npm run build -- --aot --output-hashing=all version:minor

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/sportino-app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
