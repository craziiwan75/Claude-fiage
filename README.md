# 工蜂办公 · 移动办公助手

> **复赛全栈交付**：React Native (Expo) + Flask + SQLAlchemy + MySQL，覆盖人工专高复赛全部 5 个核心模块。

## 项目概览

| 模块         | 实现                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| **一、用户管理**     | Employee CRUD，姓名/年龄/邮箱校验（Marshmallow），FlatList + 下拉刷新 + 删除二次确认           |
| **二、登录 + JWT**   | bcrypt 密码、PyJWT 颁发、Flask-JWT-Extended 守卫、axios 自动加 Bearer、401 自动跳登录          |
| **三、设备分类 + 关联** | Category 1:N Device 外键 + RESTRICT；删除分类时校验设备数；`/api/categories/<id>/devices` 联表查询 |
| **四、API 日志中间件**  | `before_request` + `after_request`，RotatingFileHandler 滚动 5MB×5，含真实 IP / 耗时       |
| **五、统一响应 + 全局异常** | `{code, message, data}` 包装；ValidationError/JWTError/IntegrityError/HTTPException/Exception 统一拦截 |

## 目录结构

```
gongfeng-app/
├── README.md            # 本文件
├── docker-compose.yml   # MySQL + 后端一键启动
├── backend/             # Flask + SQLAlchemy + MySQL
│   ├── README.md
│   ├── app/             # Controller / Service / Model / Schema 分层
│   ├── init.sql         # 建表 + 种子数据
│   └── run.py
└── frontend/            # React Native (Expo)
    ├── README.md
    ├── App.js
    └── src/             # api / contexts / navigation / screens / components
```

## 三种启动方式

### A. Docker Compose（最快）

```bash
cd gongfeng-app
docker compose up -d --build
# 后端 → http://localhost:5000
# Swagger → http://localhost:5000/swagger
```

然后进入前端：

```bash
cd frontend
npm install
npm start             # 选择 i / a 启动模拟器
```

### B. 本地 Python + 本地 MySQL

1. 启动一个本地 MySQL 8（确认监听 3306）。
2. `mysql -u root -p < backend/init.sql`
3. `cd backend && python -m venv .venv && source .venv/bin/activate`
4. `pip install -r requirements.txt`
5. `cp .env.example .env`（按需修改）
6. `python -m app.seed` 创建管理员
7. `flask --app run.py run --debug --port 5000`

前端同上。

### C. 仅看高保真设计稿

`gongfeng-app` 同级有 `index.html`（设计交付物），用浏览器打开即可。

## 测试账号

| 用户名 | 密码     | 角色  |
| ------ | -------- | ----- |
| admin  | admin123 | admin |

## API 文档

启动后端后访问 `http://localhost:5000/swagger`（由 Flask-Smorest 自动生成）。

## 加分项已实现

- ✅ Docker 容器化（MySQL + 后端）
- ✅ OpenAPI / Swagger UI 自动生成
- ✅ 全局异常拦截 + 统一响应体
- ✅ 日志滚动 + 控制台双输出
- ✅ Health check 端点
- ✅ 前端 Context API + Hooks（无重型状态库依赖）
- ✅ CORS 配置 / 环境变量驱动
- ✅ 高保真设计稿（同仓库 index.html）

## 缺省可扩展

- Migrations（已集成 Flask-Migrate，可 `flask db init` 启用）
- 单元测试（建议加 pytest + factory_boy）
- API 版本前缀（如 `/api/v1`）
- 普通员工角色 + RBAC

—
© 2026 工蜂办公 · 复赛提交版本
