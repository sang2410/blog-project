# Build stage
FROM node:21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Tạo file config.js dạng ES module hoặc JSON
CMD ["sh", "-c", "echo 'export const API_URL = \"${VITE_API_PATH:-http://default-api:8080}\";' > /usr/share/nginx/html/config.js && nginx -g 'daemon off;'"]