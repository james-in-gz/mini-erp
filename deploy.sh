#!/bin/bash

set -e

echo "🚀 Starting CRM Deploy..."

PROJECT_DIR="/home/crm"

cd $PROJECT_DIR

echo "📥 Pull latest code..."
git pull origin main

echo "🐳 Building & starting containers..."
sudo docker compose up -d --build

echo "🧹 Cleaning unused images..."
sudo docker system prune -f


echo "✅ Deploy Finished!"