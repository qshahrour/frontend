# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Production stage
#FROM nginx:alpine
#COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80
EXPOSE 3000
#CMD ["nginx", "-g", "daemon off;"]
CMD ["serve", "-s", "build", "-l", "3000"]
