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
# Thêm file cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["sh", "-c", "echo 'window.API_URL = \"${API_URL}\";' > /usr/share/nginx/html/config.js && nginx -g 'daemon off;'"
