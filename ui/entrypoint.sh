#!/bin/sh
sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" /usr/share/nginx/html/index.html

# Execute CMD from Dockerfile (like "nginx -g 'daemon off;'")
exec "$@"
