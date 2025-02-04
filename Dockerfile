# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . ./
RUN rm ./proxy.conf.json
COPY proxy.conf-prod.json ./proxy.conf.json

RUN npm run build

# Stage 2: Serve the app with Nginx

FROM nginx:alpine

COPY --from=build /app/dist/sportino-app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]