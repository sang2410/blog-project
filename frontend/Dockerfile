# Build stage
FROM node:21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Giả sử bạn dùng Vite, biến môi trường được truyền lúc build
ARG VITE_API_PATH
ENV VITE_API_PATH=$VITE_API_PATH
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Truyền biến môi trường runtime (nếu cần) và khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]