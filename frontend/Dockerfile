# Stage 1: Build ứng dụng Vite
FROM node:21-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Truyền biến môi trường trong quá trình build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build ứng dụng Vite
RUN npm run build

# Stage 2: Cấu hình Nginx để phục vụ ứng dụng
FROM nginx:alpine

# Copy file build từ stage trước vào Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx (tùy chọn)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở port 80
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]