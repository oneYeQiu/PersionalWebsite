# 个人简历网站

基于 Next.js 14 的个人简历网站，包含前台展示和后台管理功能。

## 功能特性

### 前台展示
- 个人简介和头像
- 项目作品展示（支持详情页）
- 技能标签（分类展示）
- 博客文章（Markdown 支持）
- 社交链接
- 暗黑模式切换

### 后台管理
- 独立管理后台（需登录）
- 个人信息管理
- 项目作品 CRUD
- 技能标签管理
- 博客文章管理（Markdown 编辑器）
- 社交链接管理

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL (Neon)
- **ORM**: Prisma
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填写数据库连接信息：

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET="your-secret-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
```

### 3. 设置数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送 schema 到数据库
npm run db:push

# 初始化默认数据
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000 查看网站

### 5. 访问后台管理

- 前台: http://localhost:3000
- 后台: http://localhost:3000/admin
- 默认账号: admin / admin123（请及时修改）

## 部署到 Vercel

1. Fork 或推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## 项目结构

```
├── prisma/
│   ├── schema.prisma    # 数据库 Schema
│   └── seed.ts          # 初始化数据
├── src/
│   ├── app/
│   │   ├── admin/       # 后台管理页面
│   │   ├── api/         # API 路由
│   │   └── page.tsx     # 首页
│   ├── components/      # 组件
│   └── lib/             # 工具函数
├── scripts/
│   └── setup.bat        # Windows 快速设置脚本
└── ...
```

## API 文档

### 认证
- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/session` - 获取会话状态

### 用户信息
- `GET /api/user` - 获取用户信息
- `PUT /api/user` - 更新用户信息

### 项目作品
- `GET /api/projects` - 获取已发布项目
- `GET /api/projects/all` - 获取所有项目
- `POST /api/projects` - 创建项目
- `GET /api/projects/[slug]` - 获取项目详情
- `PUT /api/projects/[slug]` - 更新项目
- `DELETE /api/projects/[slug]` - 删除项目

### 技能标签
- `GET /api/skills` - 获取技能列表
- `POST /api/skills` - 添加技能
- `PUT /api/skills` - 批量更新技能
- `DELETE /api/skills/[id]` - 删除技能

### 博客文章
- `GET /api/posts` - 获取已发布文章
- `GET /api/posts/all` - 获取所有文章
- `POST /api/posts` - 创建文章
- `GET /api/posts/[slug]` - 获取文章详情
- `PUT /api/posts/[slug]` - 更新文章
- `DELETE /api/posts/[slug]` - 删除文章

### 社交链接
- `GET /api/social-links` - 获取公开链接
- `GET /api/social-links/all` - 获取所有链接
- `POST /api/social-links` - 添加链接
- `PUT /api/social-links/[id]` - 更新链接
- `DELETE /api/social-links/[id]` - 删除链接

## 许可证

MIT
