# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG API_URL
ENV API_URL=pyapi.dev.svc.cluster.local

RUN npm run build

# Stage 2: Serve
FROM nginx:1.27.1
COPY --from=build /app/dist /var/www/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
