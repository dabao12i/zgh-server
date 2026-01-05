# API 文档

本文档记录了项目中的文件管理和用户管理API。

## 1. 文件管理

### 1.1 功能实现概述

1.  **安装依赖**: 安装 `multer` 用于文件上传。
2.  **创建目录**: 创建 `uploads/` 目录存储文件。
3.  **新增模块**:
    *   `middleware/upload.js`: 配置 `multer`。
    *   `controllers/fileController.js`: 文件上传和删除的业务逻辑。
    *   `routers/fileRouter.js`: 文件操作相关路由。
4.  **修改核心文件**:
    *   `app.js`: 添加 `express.static` 中间件以公开 `uploads/` 目录。
    *   `routers/index.js`: 在 `/api/files` 路径下注册 `fileRouter`。

### 1.2 文件管理 API

基础路径: `/api/files`

---

#### 文件上传

*   **Endpoint**: `POST /api/files/upload`
*   **描述**: 上传单个文件。
*   **请求**: `multipart/form-data`，包含一个 `name="file"` 的字段。
*   **成功响应 (Code: 200)**: 返回包含文件信息的对象 (`filename`, `path`, `size`, `url`)。
*   **Curl 示例**: `curl -X POST http://localhost:3000/api/files/upload -F "file=@/path/to/your/file.jpg"`

---

#### 文件查看

*   **Endpoint**: `GET /uploads/:filename`
*   **描述**: 访问已上传的文件。
*   **URL 示例**: `http://localhost:3000/uploads/file-1672905275011.jpg`

---

#### 文件删除

*   **Endpoint**: `DELETE /api/files/:filename`
*   **描述**: 根据文件名删除服务器上的文件。
*   **成功响应 (Code: 200)**: 返回成功消息。
*   **Curl 示例**: `curl -X DELETE http://localhost:3000/api/files/file-1672905275011.jpg`

---
---

## 2. 用户管理 (管理员权限)

### 2.1 功能实现概述

1.  **数据库**: 在 `User` 模型中添加了 `role` 字段 (`'user'`, `'admin'`)。
2.  **依赖**: 安装 `bcryptjs` 用于密码哈希。
3.  **权限控制**:
    *   `middleware/authorize.js`: 新增了基于角色的授权中间件。
4.  **新增模块**:
    *   `controllers/userController.js`: 用户的增删改查业务逻辑。
    *   `routers/userRouter.js`: 用户管理相关路由。
5.  **修改核心文件**:
    *   `routers/index.js`: 在 `/api/users` 路径下注册 `userRouter`。

### 2.2 用户管理 API

**注意**: 所有用户管理接口都需要 **管理员权限**。请求时必须在 Header 中提供有效的 `Authorization: Bearer <token>`。

基础路径: `/api/users`

---

#### 创建用户

*   **Endpoint**: `POST /api/users`
*   **描述**: 管理员创建一个新用户。
*   **请求体 (JSON)**:
    ```json
    {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123",
        "role": "user"
    }
    ```
*   **成功响应 (Code: 200)**: 返回新创建的用户对象（不含密码）。

---

#### 获取所有用户

*   **Endpoint**: `GET /api/users`
*   **描述**: 获取所有用户的列表。
*   **成功响应 (Code: 200)**: 返回用户对象数组（不含密码）。

---

#### 获取单个用户

*   **Endpoint**: `GET /api/users/:id`
*   **描述**: 根据ID获取单个用户的信息。
*   **成功响应 (Code: 200)**: 返回单个用户对象（不含密码）。

---

#### 更新用户

*   **Endpoint**: `PUT /api/users/:id`
*   **描述**: 根据ID更新用户信息（`username`, `email`, `role`）。
*   **请求体 (JSON)**:
    ```json
    {
        "email": "updated@example.com",
        "role": "admin"
    }
    ```
*   **成功响应 (Code: 200)**: 返回更新后的用户对象（不含密码）。

---

#### 删除用户

*   **Endpoint**: `DELETE /api/users/:id`
*   **描述**: 根据ID删除一个用户。
*   **成功响应 (Code: 200)**: 返回成功消息。

```
