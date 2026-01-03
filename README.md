# Companion Platform Backend API

安全版陪伴平台后端API，基于FastAPI + PostgreSQL + Telegram WebApp认证。

## 技术栈

- **框架**: FastAPI 0.104+
- **数据库**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **迁移**: Alembic
- **认证**: Telegram WebApp initData + JWT
- **支付**: Stripe
- **部署**: Docker + docker-compose

## 项目结构

```
backend/
├── app/
│   ├── api/
│   │   └── v1/          # API路由
│   ├── core/             # 核心配置（数据库、安全、依赖）
│   ├── models/           # SQLAlchemy模型
│   ├── schemas/          # Pydantic schemas
│   └── main.py           # FastAPI应用入口
├── alembic/              # 数据库迁移
├── requirements.txt      # Python依赖
├── Dockerfile            # Docker镜像配置
├── docker-compose.yml    # Docker Compose配置
└── .env.example          # 环境变量示例
```

## 快速开始

### 1. 环境准备

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑.env文件，填入必要的配置
# - DATABASE_URL
# - JWT_SECRET_KEY
# - TELEGRAM_BOT_TOKEN
# - STRIPE_SECRET_KEY (可选)
```

### 2. 使用Docker Compose（推荐）

```bash
# 启动所有服务（数据库 + API）
docker-compose up -d

# 查看日志
docker-compose logs -f api

# 停止服务
docker-compose down
```

### 3. 本地开发

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 运行数据库迁移
alembic upgrade head

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API文档

启动服务后，访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 核心功能

### 1. 认证系统
- **POST /v1/auth/telegram**: Telegram WebApp认证，返回JWT token
- 所有后续请求需要在Header中携带: `Authorization: Bearer <token>`

### 2. 用户管理
- **GET /v1/me**: 获取当前用户信息
- **PATCH /v1/me**: 更新用户信息
- **GET /v1/me/bookings**: 我的预约列表
- **GET /v1/me/orders**: 我的订单列表

### 3. 服务者入驻
- **POST /v1/providers/apply**: 提交入驻申请
- **GET /v1/providers/me**: 查看自己的档案
- **PATCH /v1/providers/me**: 更新服务者资料
- **POST /v1/providers/me/media**: 上传作品集

### 4. 服务项目
- **GET /v1/services**: 服务项列表
- **GET /v1/services/{id}**: 服务项详情
- **PUT /v1/providers/me/service-pricing**: 设置服务报价

### 5. 档期管理
- **POST /v1/providers/me/availabilities**: 创建可预约档期（批量）
- **GET /v1/providers/{id}/availabilities**: 查看服务者可预约档期

### 6. 预约系统
- **POST /v1/bookings**: 创建预约请求
- **GET /v1/bookings/{id}**: 预约详情
- **PATCH /v1/bookings/{id}/provider/accept**: 服务者接单
- **PATCH /v1/bookings/{id}/provider/reject**: 服务者拒单
- **PATCH /v1/bookings/{id}/cancel**: 取消预约

### 7. 订单与支付
- **POST /v1/orders**: 创建订单
- **POST /v1/payments/checkout**: 创建支付会话（Stripe）
- **POST /v1/payments/webhook**: Stripe支付回调

### 8. 评价系统
- **POST /v1/bookings/{id}/review**: 用户评价服务者
- **GET /v1/providers/{id}/reviews**: 查看服务者评价

### 9. 安全与风控
- **POST /v1/safety/boundary-ack**: 记录边界确认
- **POST /v1/safety/reports**: 提交投诉/举报
- **GET /v1/safety/reports/me**: 我提交的投诉

### 10. 管理员功能
- **GET /v1/admin/provider-applications**: 查看入驻申请
- **PATCH /v1/admin/provider-applications/{id}**: 审核申请
- **GET /v1/admin/reports**: 查看投诉列表
- **POST /v1/admin/services**: 创建服务项

## 数据库迁移

```bash
# 创建新迁移
alembic revision --autogenerate -m "description"

# 应用迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

## 环境变量说明

| 变量 | 说明 | 必需 |
|------|------|------|
| DATABASE_URL | PostgreSQL连接字符串 | ✅ |
| JWT_SECRET_KEY | JWT签名密钥 | ✅ |
| TELEGRAM_BOT_TOKEN | Telegram Bot Token | ✅ |
| STRIPE_SECRET_KEY | Stripe密钥（支付功能） | ❌ |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook密钥 | ❌ |
| ENVIRONMENT | 环境（development/production） | ❌ |

## 安全特性

1. **Telegram WebApp验签**: 验证initData的hash签名和时效性
2. **JWT认证**: 所有API请求需要有效的JWT token
3. **RBAC权限控制**: USER/PROVIDER/ADMIN角色权限分离
4. **支付安全**: Stripe webhook签名验证 + 防重放
5. **请求日志**: 记录request_id、user_id、路由、状态码、延迟

## 开发注意事项

1. **数据库模型**: 所有模型在 `app/models/` 目录
2. **API路由**: 所有路由在 `app/api/v1/` 目录
3. **Schema验证**: 使用Pydantic进行请求/响应验证
4. **错误处理**: 使用FastAPI的HTTPException
5. **数据库事务**: 使用SQLAlchemy的session管理

## 部署

### 生产环境建议

1. 使用环境变量管理敏感信息
2. 配置HTTPS和CORS
3. 设置数据库连接池
4. 配置日志收集（如ELK、Sentry）
5. 使用反向代理（Nginx）
6. 定期备份数据库

## 许可证

私有项目




