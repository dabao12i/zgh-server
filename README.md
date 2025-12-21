# 微信公众号排版项目后端服务介绍与使用指南

## 前言

欢迎来到您的“微信公众号排版项目”的后端服务！这个项目旨在为您提供强大的数据支持和业务逻辑处理能力，帮助您构建一个高效、灵活且易于维护的排版平台。本后端服务基于 Express.js 构建，并集成了多项最佳实践，助您快速开启业务开发。

## 项目概览

当前后端服务已具备以下核心特性：

*   **统一响应结构**：所有 API 接口返回统一的 JSON 格式，便于前端处理。
*   **健壮的错误处理**：全局捕获和处理同步及异步错误，并以统一格式响应。
*   **清晰的日志记录**：使用 Winston 进行灵活的日志管理。
*   **多环境配置**：支持开发、生产等不同环境的配置管理。
*   **模块化代码结构**：采用路由-控制器分离模式，代码组织清晰。
*   **Apifox 文档管理支持**：便于您在 Apifox 中管理和测试 API 接口。

## 启动方法

请确保您已在 `server` 目录下安装了所有依赖 (`npm install`)。

### 1. 开发环境启动

在开发阶段，我们使用 `nodemon` 实现代码热重载，提高开发效率。

```bash
cd server
npm run dev
```

*   **端口**：默认运行在 `http://localhost:3000` (可在 `.env.development` 中配置)。
*   **日志**：日志会输出到控制台，便于调试。
*   **特点**：当您修改代码时，服务会自动重启。

### 2. 生产环境启动

在部署到生产环境时，请使用以下命令：

```bash
cd server
npm start
```

*   **端口**：默认运行在 `http://localhost:8080` (可在 `.env.production` 中配置)。
*   **日志**：日志会记录到 `logs/` 目录下（`error.log` 和 `combined.log`），控制台输出较少。
*   **特点**：以生产模式优化运行，性能更高，错误信息更精简。

## 参数配置说明

项目通过 `.env` 文件来管理环境变量，方便您在不同环境配置不同的参数，而无需修改代码。

### 1. 配置文件

*   **`.env.development` (位于 `server/` 目录)**：
    *   用于**开发环境**的配置。
    *   **示例内容**：
        ```ini
        # 应用监听端口
        PORT=3000

        # 当前运行环境
        NODE_ENV=development
        ```
*   **`.env.production` (位于 `server/` 目录)**：
    *   用于**生产环境**的配置。
    *   **示例内容**：
        ```ini
        # 应用监听端口
        PORT=8080

        # 当前运行环境
        NODE_ENV=production

        # 数据库连接字符串 (未来可能添加)
        # DB_CONNECTION_STRING=mongodb://user:pass@host:port/dbname
        ```

### 2. 配置项说明

*   **`PORT`**：服务监听的端口号。请根据需要修改。
*   **`NODE_ENV`**：当前服务的运行环境，会自动设置为 `development` 或 `production`。这是区分不同环境配置的关键。

**如何修改配置：**
直接编辑对应的 `.env.development` 或 `.env.production` 文件即可。修改后请重启服务以使配置生效。

**重要提示：** `.env` 文件（包括 `.env.development` 和 `.env.production`）不应被提交到版本控制系统（已通过 `.gitignore` 排除），以防敏感信息泄露。 `.env.example` 文件是配置模板，您可以据此创建自己的 `.env` 文件。

## 项目结构概览

了解项目结构，有助于您快速定位和编写业务代码。

```
server/
├── config/             # 核心配置文件 (logger.js, codes.js 等)
├── controllers/        # 业务控制器文件，您的业务逻辑将在这里实现
├── middleware/         # 自定义中间件 (errorHandler.js, asyncHandler.js 等)
├── node_modules/       # 项目依赖包 (由 npm install 生成)
├── routers/            # API 路由定义文件 (index.js 是主入口)
├── utils/              # 工具函数 (responseHandler.js)
├── .env.development    # 开发环境配置文件
├── .env.production     # 生产环境配置文件
├── .gitignore          # Git 忽略文件
├── app.js              # Express 应用主入口文件
├── package.json        # 项目元数据与依赖管理
└── package-lock.json   # 依赖锁定文件
```

## 如何编写新的 API 接口 (业务逻辑)

您可以按照以下流程来添加新的 API 接口：

1.  **定义控制器**：
    *   在 `server/controllers/` 目录下创建一个新的控制器文件，例如 `server/controllers/layoutController.js`。
    *   在该文件中编写您的业务逻辑函数，例如 `getTemplates`、`saveLayout` 等。这些函数应接收 `req, res` 参数。
    *   示例：
        ```javascript
        // server/controllers/layoutController.js
        const getTemplates = (req, res) => {
          // 这里编写获取排版模板的业务逻辑
          const templates = [{ id: 't1', name: '简约风格' }];
          res.cc(templates, '获取模板成功');
        };
        module.exports = { getTemplates };
        ```
2.  **定义路由**：
    *   在 `server/routers/index.js` 中导入您新创建的控制器函数。
    *   使用 `router.get()`, `router.post()`, `router.put()`, `router.delete()` 等方法定义新的 API 路由。
    *   **示例**：
        ```javascript
        // server/routers/index.js (部分代码)
        const { getTemplates } = require('../controllers/layoutController'); // 导入控制器

        // 定义获取排版模板的路由
        router.get('/layouts/templates', getTemplates);
        ```
3.  **核心开发约定**：
    *   **统一响应**：在控制器中始终使用 `res.cc(data, msg)` 发送成功响应。
    *   **异步捕获**：如果控制器函数是 `async` 函数，请使用 `asyncHandler` 包装它，例如 `router.get('/async-data', asyncHandler(async (req, res) => { /* ... */ }));`
    *   **错误处理**：在控制器中遇到业务错误时，可以直接 `throw new Error('错误消息');`，或 `res.cc(null, '业务错误', codes.BUSINESS_ERROR);`，全局错误处理器会统一处理。



## 下一步

现在，您已经拥有了一个干净、结构化的 Express.js 后端项目，并了解了它的核心特性和使用方法。是时候开始编写您的微信公众号排版项目的具体业务逻辑了！

祝您开发顺利！
