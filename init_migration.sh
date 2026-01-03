#!/bin/bash

# 初始化数据库迁移脚本

echo "Initializing database migration..."

# 检查.env文件
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# 运行迁移
echo "Creating initial migration..."
alembic revision --autogenerate -m "Initial migration"

echo "Migration created. Run 'alembic upgrade head' to apply it."




