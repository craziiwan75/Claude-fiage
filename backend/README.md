# 工蜂办公 · 后端 (Flask + SQLAlchemy + MySQL)

## 技术栈

- Flask 3 + **Flask-Smorest**（蓝图 + 自动 OpenAPI）
- SQLAlchemy 2 ORM + Flask-Migrate
- Flask-JWT-Extended（PyJWT）+ bcrypt
- 全局 Logging 中间件（StreamHandler + RotatingFileHandler）
- 统一响应体 `{code, message, data}` + 全局异常拦截器

## 目录结构

```
app/
├── __init__.py          # 应用工厂
├── config.py            # 环境变量驱动配置
├── extensions.py        # db / migrate / jwt 单例
├── models/              # Model 层（实体 + 关联）
├── schemas/             # DTO/Serializer 层（Marshmallow）
├── services/            # 业务逻辑层
├── controllers/         # Controller/ViewSet 层（蓝图）
├── middlewares/
│   └── logging.py       # API 访问日志中间件
├── exceptions/
│   ├── __init__.py      # BusinessError / NotFoundError
│   └── handlers.py      # 全局异常 -> 统一响应
└── utils/
    └── response.py      # ok() / fail() 包装
```

## 启动

```bash
# 1. 创建虚拟环境 + 安装依赖
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2. 准备 .env
cp .env.example .env                # 然后改里面的密钥、数据库地址等

# 3. 初始化数据库（任选其一）
mysql -u root -p < init.sql         # ① 直接跑 SQL
python -m app.seed                   # ② 用 ORM 建表 + 种子管理员

# 4. 启动
flask --app run.py run --debug --port 5000
# 生产：gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

启动后：

- 接口前缀：`http://localhost:5000/api`
- Swagger UI：`http://localhost:5000/swagger`
- Healthcheck：`http://localhost:5000/health`

## 测试账号

| 用户名 | 密码     | 角色 |
| ------ | -------- | ---- |
| admin  | admin123 | admin |

## 关键接口

| 方法    | 路径                                       | 说明                                  |
| ------- | ------------------------------------------ | ------------------------------------- |
| POST    | `/api/auth/login`                        | 登录（公开） · 返回 JWT               |
| GET     | `/api/employees?page=1&page_size=20`     | 员工列表（分页 / 倒序）               |
| POST    | `/api/employees`                         | 新增员工                              |
| GET/PUT/DELETE | `/api/employees/<id>`             | 单员工 查询 / 修改 / 删除             |
| GET     | `/api/categories`                        | 分类列表（含 device_count）           |
| POST    | `/api/categories`                        | 新增分类                              |
| PUT/DELETE | `/api/categories/<id>`                | 修改 / 删除（有设备时拒绝 → 409）     |
| GET     | `/api/categories/<id>/devices`           | 联表查询：分类下所有设备              |
| GET     | `/api/devices?category_id=<id>`          | 设备列表 / 按分类过滤                 |
| POST    | `/api/devices`                           | 新增设备（校验分类存在）              |
| GET/PUT/DELETE | `/api/devices/<id>`              | 单设备 操作                           |

## 统一响应格式

```json
{
  "code": 200,
  "message": "成功",
  "data": { ... }
}
```

| code | 含义                                |
| ---- | ----------------------------------- |
| 200  | 成功                                |
| 400  | 参数校验失败 / 分类不存在等业务校验 |
| 401  | 未授权 / 令牌过期                    |
| 403  | 权限不足                            |
| 404  | 资源不存在                          |
| 409  | 业务冲突（如分类下有设备无法删除）  |
| 500  | 系统异常                            |

## 日志

- 控制台 + `./logs/app.log`（5MB × 5 滚动）
- 格式：`2026-05-22 14:32:18 INFO  app.access | [GET] /api/employees  ip=127.0.0.1  status=200  cost=42.3ms`
- 中间件不读 body，不修改响应内容，仅追加 `X-Response-Time` Header。
