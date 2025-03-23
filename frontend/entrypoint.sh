#!/bin/sh
# Tạo file config.js từ các biến môi trường
cat <<EOF > /usr/share/nginx/html/config.js
window.env = {
  API_URL: "${API_URL}",
#   APP_ENV: "${APP_ENV}"
};
EOF

# Kiểm tra file config.js (tùy chọn, để debug)
echo "Generated config.js:"
cat /usr/share/nginx/html/config.js

# Chạy Nginx
exec "$@"