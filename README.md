# 协同编辑文档

这是一个基于Turborepo的协同编辑文档项目，使用React和Yjs实现实时协作功能。

## 项目结构

```
CollaborativeDoc/
├── apps/
│   ├── web/          # 前端应用
│   └── api/          # 后端API服务
└── packages/
    ├── editor/       # 协同编辑器组件
    ├── ui/           # UI组件库
    ├── eslint-config/# ESLint配置
    └── typescript-config/ # TypeScript配置
```

## 技术栈

- **前端**: React, Next.js, TipTap编辑器
- **后端**: Node.js, Express, WebSocket
- **协同编辑**: Yjs, WebSocket
- **构建工具**: Turborepo, PNPM Workspaces

## 功能

- 实时协同编辑文档
- 显示用户光标位置和编辑状态
- 多人同时编辑不冲突
- 离线编辑支持

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行开发环境

```bash
# 启动所有服务
pnpm dev

# 或者单独启动
pnpm --filter=api dev  # 启动API服务
pnpm --filter=web dev  # 启动Web应用
```

### 构建项目

```bash
pnpm build
```

## 使用方法

1. 访问 http://localhost:3000
2. 点击 "打开协同编辑器" 链接
3. 输入用户名和文档ID（或创建新文档）
4. 开始编辑!

## 核心技术说明

### CRDT (Conflict-free Replicated Data Type)

本项目使用Yjs实现CRDT，这是一种允许多人同时编辑而不会产生冲突的数据结构。

### 协同编辑流程

1. 用户加入文档
2. WebSocket连接建立
3. 本地编辑同步到其他用户
4. 其他用户的编辑实时显示在本地

## 许可证

MIT
