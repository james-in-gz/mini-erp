#!/bin/bash

set -e

echo "🚀 Starting CRM Deploy..."

PROJECT_DIR="/home/crm"
DOMAIN="crm.yourdomain.com"

cd $PROJECT_DIR

echo "📥 Pull latest code..."
git pull origin main

echo "🐳 Building & starting containers..."
docker compose up -d --build

echo "🧹 Cleaning unused images..."
docker system prune -f

echo "🌐 Configuring Nginx..."

NGINX_CONF="/etc/nginx/sites-available/crm"

if [ ! -f "$NGINX_CONF" ]; then
  cat <<EOF > $NGINX_CONF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
    }
}
EOF

  ln -sf $NGINX_CONF /etc/nginx/sites-enabled/crm
fi

echo "🔍 Testing Nginx config..."
nginx -t

echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo "🔐 Setting up HTTPS..."

if ! certbot certificates | grep -q "$DOMAIN"; then
  certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m your@email.com
else
  echo "✅ SSL already exists"
fi

echo "✅ Deploy Finished!"