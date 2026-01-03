#!/bin/bash

# 启动脚本

echo "Starting Companion Platform Backend..."

# 检查.env文件
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# 运行数据库迁移
echo "Running database migrations..."
alembic upgrade head

# 启动服务器
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload




