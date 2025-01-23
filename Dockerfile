# STAGE 1

FROM docker.io/node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# STAGE 2

FROM docker.io/nginxinc/nginx-unprivileged AS serve-stage

RUN sed -i 's/^ *index  index.html index.htm;/        try_files $uri $uri\/ \/index.html;/' /etc/nginx/conf.d/default.conf 

COPY --from=build-stage /app/dist /usr/share/nginx/html


# METADATA #

EXPOSE 8080