#!/bin/sh

cp /usr/share/nginx/html/index.html /usr/share/nginx/html/index.template.html
envsubst < /usr/share/nginx/html/index.template.html > /usr/share/nginx/html/index.html

# Execute CMD from Dockerfile (like "nginx -g 'daemon off;'")
exec "$@"
