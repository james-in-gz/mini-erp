#!/bin/bash

set -e

echo "🚀 Starting CRM Deploy..."

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$REPO_DIR" || exit

echo "当前目录: $REPO_DIR"

BRANCH="main"

cd $REPO_DIR || exit

echo "🔄 checking updates..."

# 拉远程信息
git fetch origin

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/$BRANCH)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "🚀 new version detected, deploying..."

  # 强制对齐远程代码（不会影响 .env，因为你已经移出仓库了）
  git reset --hard origin/$BRANCH

  sudo chmod +x $REPO_DIR/deploy.sh

  # 重新构建并启动（不会删 volume / 数据）
  sudo docker compose --env-file ../.env up -d --build

  echo "✅ deploy success"
else
  echo "👌 no changes"
fi