# 快速启动指南

## 前置要求

- Python 3.11+
- PostgreSQL 15+ (或使用Docker)
- Telegram Bot Token

## 方式一：使用Docker Compose（推荐）

### 1. 配置环境变量

```bash
cd backend
cp .env.example .env
# 编辑.env文件，至少配置：
# - ENV=dev (环境: dev|staging|prod，默认dev)
# - DATABASE_URL (docker-compose会自动创建，默认: postgresql://user:password@db:5432/companion_db)
# - JWT_SECRET_KEY (生成一个随机字符串，生产环境至少32字符)
# - TELEGRAM_BOT_TOKEN (从@BotFather获取)
# - STRIPE_SECRET_KEY (可选，仅在使用支付功能时需要)
```

**环境配置说明**:
- `ENV=dev`: 开发环境（默认），启动时校验较宽松
- `ENV=staging`: 预发布环境，完整校验
- `ENV=prod`: 生产环境，严格校验（JWT_SECRET_KEY至少32字符，CORS不能为*）

**启动时校验**: 应用启动时会自动校验必填环境变量，缺失时会显示清晰错误并退出。

### 2. 启动服务

```bash
docker-compose up -d
```

### 3. 运行数据库迁移

```bash
docker-compose exec api alembic upgrade head
```

### 4. 访问API文档

打开浏览器访问: http://localhost:8000/docs

## 方式二：本地开发

### 1. 安装依赖

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑.env文件
```

### 3. 启动PostgreSQL

确保PostgreSQL正在运行，或使用Docker：

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=companion_db \
  -p 5432:5432 \
  postgres:15-alpine
```

### 4. 运行数据库迁移

```bash
alembic upgrade head
```

### 5. 启动开发服务器

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 测试认证流程

### 1. 获取Telegram WebApp initData

在前端Telegram WebApp中，可以通过以下方式获取initData：

```javascript
const initData = window.Telegram.WebApp.initData;
```

### 2. 调用认证接口

```bash
curl -X POST "http://localhost:8000/v1/auth/telegram" \
  -H "Content-Type: application/json" \
  -d '{
    "initData": "query_id=...&user=...&hash=..."
  }'
```

### 3. 使用返回的token访问API

```bash
curl -X GET "http://localhost:8000/v1/me" \
  -H "Authorization: Bearer <your_token>"
```

## 创建初始数据（可选）

### 创建服务项

```bash
curl -X POST "http://localhost:8000/v1/admin/services" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "COMPANION",
    "name": "陪伴体验",
    "description": "基础陪伴服务",
    "duration_min": 60,
    "duration_max": 120,
    "price_min_cents": 5000,
    "price_max_cents": 15000
  }'
```

## 常见问题

### 1. 数据库连接失败

- 检查PostgreSQL是否运行: `docker ps` 或 `pg_isready`
- 检查DATABASE_URL配置是否正确
- 确保数据库已创建

### 2. Telegram认证失败

- 检查TELEGRAM_BOT_TOKEN是否正确
- 确认initData格式正确
- 检查auth_date是否过期（24小时内）

### 3. 迁移失败

- 确保数据库已创建
- 检查DATABASE_URL权限
- 尝试删除alembic_version表后重新迁移

## 下一步

1. 阅读 [README.md](README.md) 了解完整API文档
2. 查看 `/docs` 端点查看交互式API文档
3. 配置Stripe支付（如需要）
4. 部署到生产环境

