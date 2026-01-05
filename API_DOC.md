# 文件上传、查看和删除API文档

本文档记录了为项目添加的文件管理功能，包括接口实现和使用方法。

## 1. 功能实现概述

为了实现文件管理功能，执行了以下操作：

1.  **安装依赖**:
    *   添加了 `multer` 库来处理 `multipart/form-data` 类型的表单数据，主要用于文件上传。
    ```bash
    npm install multer
    ```

2.  **创建目录**:
    *   在项目根目录下创建了 `uploads/` 文件夹，作为所有上传文件的存储位置。

3.  **新增模块**:
    *   `middleware/upload.js`: 配置 `multer`，包括文件存储位置、文件名生成规则、文件大小和类型限制。
    *   `controllers/fileController.js`: 包含处理文件上传和删除请求的核心业务逻辑。
    *   `routers/fileRouter.js`: 定义与文件操作相关的路由 (`POST /upload`, `DELETE /:filename`)。

4.  **修改核心文件**:
    *   `app.js`: 添加了 `express.static` 中间件，将 `uploads/` 目录公开为静态资源，允许通过URL直接访问文件。
    *   `routers/index.js`: 注册了 `fileRouter`，将其挂载到 `/api/files` 路径下。

## 2. API 接口说明

基础路径: `/api/files`

---

### 文件上传

*   **Endpoint**: `POST /api/files/upload`
*   **描述**: 上传单个文件。请求体必须是 `multipart/form-data` 格式。
*   **请求**:
    *   **方法**: `POST`
    *   **Headers**: `Content-Type: multipart/form-data`
    *   **Body**: 表单中需要有一个 `name` 为 `file` 的字段，其值为要上传的文件。

*   **成功响应 (Code: 200)**:
    ```json
    {
        "code": 200,
        "msg": "File uploaded successfully",
        "data": {
            "filename": "file-1672905275011.jpg",
            "path": "uploads\\file-1672905275011.jpg",
            "size": 12345,
            "mimetype": "image/jpeg",
            "url": "/uploads/file-1672905275011.jpg"
        }
    }
    ```

*   **失败响应**:
    *   **Code `1001` (INVALID_PARAMS)**: 如果文件类型不符合要求（允许的类型：`jpeg`, `jpg`, `png`, `gif`, `pdf`, `doc`, `docx`）。
    *   **Code `1002` (MISSING_PARAMS)**: 如果请求中没有包含文件。

*   **Curl 示例**:
    ```bash
    curl -X POST http://localhost:3000/api/files/upload -F "file=@/path/to/your/file.jpg"
    ```

---

### 文件查看

*   **Endpoint**: `GET /uploads/:filename`
*   **描述**: 通过文件名直接访问或下载已上传的文件。
*   **请求**:
    *   **方法**: `GET`
*   **成功响应**:
    *   返回文件内容，`Content-Type` 会根据文件类型自动设置。

*   **URL 示例**:
    `http://localhost:3000/uploads/file-1672905275011.jpg`

---


### 文件删除

*   **Endpoint**: `DELETE /api/files/:filename`
*   **描述**: 根据文件名删除服务器上的一个文件。
*   **请求**:
    *   **方法**: `DELETE`
    *   **URL 参数**:
        *   `filename`: 要删除的文件的名称（例如 `file-1672905275011.jpg`）。

*   **成功响应 (Code: 200)**:
    ```json
    {
        "code": 200,
        "msg": "File deleted successfully.",
        "data": {
            "filename": "file-1672905275011.jpg"
        }
    }
    ```

*   **失败响应**:
    *   **Code `1001` (INVALID_PARAMS)**: 如果文件名包含非法字符（如 `..` 或 `/`）。
    *   **Code `2001` (NOT_FOUND)**: 如果服务器上不存在该文件。

*   **Curl 示例**:
    ```bash
    curl -X DELETE http://localhost:3000/api/files/file-1672905275011.jpg
    ```

