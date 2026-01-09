# Sharp.js 图片处理 API 文档

本文档详细介绍了新添加的基于 `sharp.js` 的图片处理 API 的功能、使用方法和技术实现。

## 1. 概述

为了满足对上传图片进行实时处理的需求，我们集成 `sharp.js` 库，并新增了一个 API 端点。该接口允许客户端上传图片文件，服务器端在不将原始文件存入磁盘的情况下，直接在内存中对其进行处理（如调整尺寸、转换格式），并将处理后的新图片保存到服务器，最终返回可公开访问的 URL。

这个流程高效且功能强大，非常适合需要生成缩略图、优化图片格式或统一图片尺寸的场景。

## 2. API 端点详解

### POST `/api/files/process-sharp`

-   **功能描述**: 接收单个图片文件，使用 `sharp.js` 对其进行处理，保存后返回新图片的访问地址。
-   **请求方法**: `POST`
-   **请求头**: `Content-Type: multipart/form-data`
-   **请求体**: 表单中必须包含一个名为 `file` 的文件字段。

#### 使用示例 (cURL)

```bash
curl -X POST -F "file=@/path/to/your/image.jpg" http://localhost:3000/api/files/process-sharp
```
> 将 `/path/to/your/image.jpg` 替换为您的本地图片路径。

#### 成功响应 (200 OK)

请求成功后，API 会返回一个 JSON 对象，其中 `data` 字段包含了处理后文件的信息。

- **响应示例**:
```json
{
  "status": 0,
  "message": "Image processed and saved successfully",
  "data": {
    "filename": "example-image-1678886400000.webp",
    "path": "C:\\Users\\Administrator\\Desktop\\zgh\\zgh-server\\uploads\\example-image-1678886400000.webp",
    "url": "/uploads/example-image-1678886400000.webp"
  }
}
```

#### 失败响应

如果请求中未包含文件，服务器会返回错误信息：

```json
{
  "status": 4001,
  "message": "Please upload an image file."
}
```

## 3. 展示的 `sharp.js` 功能

在此次集成中，我们主要展示了 `sharp.js` 的以下核心功能：

1.  **从 Buffer 读取**:
    -   我们使用 `multer` 的 `memoryStorage` 将上传的文件暂存于内存中（`req.file.buffer`）。
    -   `sharp(req.file.buffer)` 直接从内存缓冲区读取图片数据进行处理，避免了磁盘 I/O，性能更佳。

2.  **调整图片尺寸 (`.resize()`)**:
    -   通过调用 `.resize(800)`，我们将图片宽度调整为 800 像素。
    -   `sharp.js` 会自动计算高度以保持原始图片的宽高比，防止图片拉伸变形。

3.  **格式转换与质量控制 (`.webp()`)**:
    -   我们使用 `.webp({ quality: 80 })` 将图片转换为现代、高效的 `WebP` 格式。
    -   `WebP` 格式在保持高质量的同时，通常比 `JPEG` 或 `PNG` 文件体积更小，有利于加快网站加载速度。
    -   `quality: 80` 参数在视觉质量和文件大小之间取得了很好的平衡。

4.  **保存处理后的文件 (`.toFile()`)**:
    -   使用 `.toFile(outputPath)` 方法将内存中处理完成的图片数据异步写入到服务器的 `/uploads` 目录中。

## 4. 文件命名规则

为了防止处理后的文件重名导致覆盖，我们采用了 **“原始文件名-时间戳.webp”** 的命名策略。例如，上传 `my-photo.jpg` 会生成类似 `my-photo-1678886400000.webp` 的文件名，确保了每个处理后文件的唯一性。
