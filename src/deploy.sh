#!/bin/bash

echo "🚀 开始部署数据星图 v2.0 到 Cloudflare Pages..."

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  未检测到 Wrangler CLI,正在安装..."
    npm install -g wrangler
fi

# 检查是否已登录
echo "📝 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "🔐 请登录 Cloudflare 账户..."
    wrangler login
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 构建项目
echo "🔨 构建生产版本..."
npm run build

# 部署到 Cloudflare Pages
echo "🌐 部署到 Cloudflare Pages..."
wrangler pages deploy dist --project-name=data-constellation

echo "✅ 部署完成!"
echo "🎉 数据星图 v2.0 已成功部署!"
