# Sharp.js 图片处理 API 文档

## 概述

本项目集成了 Sharp.js 库，提供了强大的图片处理功能。Sharp 是一个高性能的 Node.js 图片处理库，支持多种图片格式和转换操作。

## 安装依赖

```bash
npm install sharp
```

## 功能列表

### 1. 压缩图片 (Compress Image)

**端点**: `POST /api/images/compress`

**描述**: 压缩图片文件，减小文件大小。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `quality` (Number, 可选) - 压缩质量 (1-100)，默认 80
- `format` (String, 可选) - 输出格式 (jpeg, png, webp)，默认 jpeg

**响应**: 返回压缩后的图片二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/compress \
  -F "file=@image.jpg" \
  -F "quality=60" \
  -F "format=webp"
```

**JavaScript/Node.js 示例**:
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('quality', 60);
formData.append('format', 'webp');

const response = await fetch('/api/images/compress', {
  method: 'POST',
  body: formData
});
const blob = await response.blob();
```

---

### 2. 缩放图片 (Resize Image)

**端点**: `POST /api/images/resize`

**描述**: 缩放图片到指定尺寸。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `width` (Number, 可选) - 目标宽度 (像素)
- `height` (Number, 可选) - 目标高度 (像素)
- `fit` (String, 可选) - 适应方式，默认 cover
  - `cover` - 覆盖整个区域，可能会裁剪
  - `contain` - 包含整个图片，可能会有空白
  - `fill` - 拉伸填充
  - `inside` - 最大尺寸，保持比例
  - `outside` - 最小尺寸，保持比例

**响应**: 返回缩放后的图片二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/resize \
  -F "file=@image.jpg" \
  -F "width=500" \
  -F "height=500" \
  -F "fit=cover"
```

**JavaScript 示例**:
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('width', 500);
formData.append('height', 500);
formData.append('fit', 'contain');

const response = await fetch('/api/images/resize', {
  method: 'POST',
  body: formData
});
```

---

### 3. 裁剪图片 (Crop Image)

**端点**: `POST /api/images/crop`

**描述**: 从图片中裁剪指定区域。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `left` (Number, 可选) - 左边距 (像素)，默认 0
- `top` (Number, 可选) - 顶部距离 (像素)，默认 0
- `width` (Number, 必需) - 裁剪宽度 (像素)
- `height` (Number, 必需) - 裁剪高度 (像素)

**响应**: 返回裁剪后的图片二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/crop \
  -F "file=@image.jpg" \
  -F "left=100" \
  -F "top=100" \
  -F "width=200" \
  -F "height=200"
```

---

### 4. 转换图片格式 (Convert Format)

**端点**: `POST /api/images/convert`

**描述**: 将图片转换为指定格式。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `format` (String, 必需) - 目标格式 (jpeg, png, webp, gif, tiff)
- `quality` (Number, 可选) - 质量 (1-100)，默认 80 (仅对 jpeg/webp 有效)

**响应**: 返回转换后的图片二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/convert \
  -F "file=@image.jpg" \
  -F "format=png"
```

**支持的格式**:
- **JPEG** - 通用格式，文件小，有损压缩
- **PNG** - 无损压缩，支持透明度
- **WebP** - 现代格式，更高的压缩率
- **GIF** - 动画支持
- **TIFF** - 高质量、大文件

---

### 5. 获取图片元数据 (Get Metadata)

**端点**: `POST /api/images/metadata`

**描述**: 获取图片的元数据信息。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件

**响应**: 返回 JSON 格式的图片元数据

**返回字段**:
```json
{
  "format": "jpeg",
  "width": 1920,
  "height": 1080,
  "space": "srgb",
  "channels": 3,
  "depth": "uchar",
  "density": 72,
  "hasAlpha": false,
  "orientation": 1,
  "pages": 1,
  "pageHeight": 1080,
  "loop": 0,
  "pagePrimary": 0,
  "hasProfile": false,
  "exif": { ... },
  "icc": { ... },
  "iptc": { ... }
}
```

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/metadata \
  -F "file=@image.jpg"
```

---

### 6. 生成缩略图 (Generate Thumbnail)

**端点**: `POST /api/images/thumbnail`

**描述**: 生成图片的缩略图。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `width` (Number, 可选) - 缩略图宽度 (像素)，默认 200
- `height` (Number, 可选) - 缩略图高度 (像素)，默认 200
- `format` (String, 可选) - 输出格式 (jpeg, png, webp)，默认 jpeg

**响应**: 返回缩略图二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/thumbnail \
  -F "file=@image.jpg" \
  -F "width=100" \
  -F "height=100" \
  -F "format=jpeg"
```

---

### 7. 添加水印 (Add Watermark)

**端点**: `POST /api/images/watermark`

**描述**: 在图片上添加文字水印。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `text` (String, 必需) - 水印文字
- `fontSize` (Number, 可选) - 字体大小，默认 40
- `color` (String, 可选) - 文字颜色 (十六进制)，默认 #FFFFFF (白色)
- `position` (String, 可选) - 水印位置，默认 bottom-right
  - `top-left` - 左上角
  - `top-right` - 右上角
  - `bottom-left` - 左下角
  - `bottom-right` - 右下角
  - `center` - 中央

**响应**: 返回添加水印后的图片二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/watermark \
  -F "file=@image.jpg" \
  -F "text=Copyright © 2024" \
  -F "fontSize=30" \
  -F "color=#FF0000" \
  -F "position=bottom-right"
```

**JavaScript 示例**:
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('text', 'Company Logo');
formData.append('fontSize', '40');
formData.append('color', '#FFFFFF');
formData.append('position', 'bottom-right');

const response = await fetch('/api/images/watermark', {
  method: 'POST',
  body: formData
});
```

---

### 8. 旋转图片 (Rotate Image)

**端点**: `POST /api/images/rotate`

**描述**: 旋转图片指定角度。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `angle` (Number, 可选) - 旋转角度，默认 90
  - `90` - 顺时针 90°
  - `180` - 旋转 180°
  - `270` - 顺时针 270°
  - `-90` - 逆时针 90°

**响应**: 返回旋转后的图片二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/rotate \
  -F "file=@image.jpg" \
  -F "angle=90"
```

---

### 9. 翻转图片 (Flip Image)

**端点**: `POST /api/images/flip`

**描述**: 翻转图片。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `direction` (String, 可选) - 翻转方向，默认 horizontal
  - `horizontal` - 水平翻转（镜像翻转）
  - `vertical` - 垂直翻转（上下翻转）

**响应**: 返回翻转后的图片二进制数据

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/flip \
  -F "file=@image.jpg" \
  -F "direction=horizontal"
```

---

### 10. 批量处理图片 (Batch Process)

**端点**: `POST /api/images/batch`

**描述**: 对图片进行多个连续的处理操作。

**请求参数**:
- `file` (File, 必需) - 上传的图片文件
- `operations` (Array, 必需) - 操作数组，每个操作包含 `type` 和 `options`

**支持的操作类型**:
- `resize` - 缩放图片
- `compress` - 压缩图片
- `crop` - 裁剪图片
- `convert` - 转换格式
- `rotate` - 旋转图片
- `flip` - 翻转图片

**操作格式**:
```json
{
  "type": "operation_type",
  "options": { /* operation specific options */ }
}
```

**示例**:
```bash
curl -X POST \
  http://localhost:3000/api/images/batch \
  -F "file=@image.jpg" \
  -F "operations=[{\"type\":\"resize\",\"options\":{\"width\":800,\"height\":600}},{\"type\":\"compress\",\"options\":{\"quality\":75,\"format\":\"jpeg\"}}]"
```

**完整示例** - 缩放、压缩、添加水印:
```json
{
  "operations": [
    {
      "type": "resize",
      "options": {
        "width": 800,
        "height": 600,
        "fit": "cover"
      }
    },
    {
      "type": "compress",
      "options": {
        "quality": 75,
        "format": "jpeg"
      }
    },
    {
      "type": "rotate",
      "options": {
        "angle": 90
      }
    }
  ]
}
```

---

## 使用场景示例

### 场景 1：生成用户头像

```bash
# 用户上传头像，需要：
# 1. 缩放到 200x200
# 2. 压缩为 webp 格式

curl -X POST \
  http://localhost:3000/api/images/batch \
  -F "file=@avatar.jpg" \
  -F "operations=[{\"type\":\"resize\",\"options\":{\"width\":200,\"height\":200,\"fit\":\"cover\"}},{\"type\":\"convert\",\"options\":{\"format\":\"webp\",\"quality\":90}}]"
```

### 场景 2：生成内容配图的多个尺寸

```javascript
// 为文章生成多种尺寸的图片
const image = document.getElementById('imageInput').files[0];

// 生成缩略图
await uploadAndProcess('thumbnail', image, [
  { type: 'resize', options: { width: 300, height: 300, fit: 'cover' } },
  { type: 'convert', options: { format: 'webp', quality: 80 } }
]);

// 生成中等尺寸
await uploadAndProcess('medium', image, [
  { type: 'resize', options: { width: 800, height: 600, fit: 'cover' } },
  { type: 'compress', options: { quality: 75 } }
]);

// 生成原始尺寸缩放版本
await uploadAndProcess('large', image, [
  { type: 'compress', options: { quality: 85, format: 'jpeg' } }
]);
```

### 场景 3：为商品图片添加水印

```bash
curl -X POST \
  http://localhost:3000/api/images/watermark \
  -F "file=@product.jpg" \
  -F "text=© Store Name" \
  -F "fontSize=50" \
  -F "color=#FFFFFF" \
  -F "position=bottom-right"
```

### 场景 4：获取图片信息用于验证

```javascript
async function validateImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/images/metadata', {
    method: 'POST',
    body: formData
  });
  
  const metadata = await response.json();
  
  // 验证图片尺寸
  if (metadata.data.width < 800 || metadata.data.height < 600) {
    console.error('图片太小');
    return false;
  }
  
  // 验证格式
  const allowedFormats = ['jpeg', 'png', 'webp'];
  if (!allowedFormats.includes(metadata.data.format)) {
    console.error('不支持的图片格式');
    return false;
  }
  
  return true;
}
```

---

## 错误处理

所有 API 返回统一的响应格式：

**成功响应**:
```json
{
  "code": 0,
  "msg": "操作成功",
  "data": { /* 数据 */ }
}
```

**错误响应**:
```json
{
  "code": 400,
  "msg": "错误描述信息",
  "data": null
}
```

**常见错误**:
- `400` - 请求参数错误
- `413` - 文件过大 (限制 10MB)
- `415` - 不支持的文件格式
- `500` - 服务器错误

---

## 性能优化建议

1. **图片格式选择**:
   - 照片类：JPEG 或 WebP（更小的文件）
   - 图表/图标：PNG 或 WebP
   - 动画：GIF 或 WebP

2. **质量设置**:
   - Web 显示：70-80
   - 高质量存储：85-95
   - 缩略图：60-70

3. **预生成尺寸**:
   - 缩略图：200x200
   - 移动端：400-600px
   - 桌面端：800-1200px
   - 大图：1600-2000px

4. **文件大小优化**:
   - 使用 WebP 格式可节省 25-35% 的文件大小
   - 合理设置压缩质量
   - 为不同设备生成不同尺寸的图片

---

## 注意事项

1. **文件大小限制**: 单个上传文件最大 10MB
2. **处理时间**: 大文件处理可能需要较长时间，建议设置合理的超时
3. **内存使用**: Sharp 在内存中处理图片，建议监控服务器内存使用
4. **批量操作**: 操作会按顺序执行，前一个操作的输出是下一个操作的输入

---

## 常见问题 (FAQ)

**Q: 如何处理动画 GIF？**
A: 支持 GIF 格式的读取，但某些操作（如旋转、翻转）可能会只处理第一帧。

**Q: 能否批量上传多个文件？**
A: 当前 API 单个请求处理一个文件，可以在前端发起多个请求。

**Q: WebP 格式的浏览器兼容性如何？**
A: WebP 在现代浏览器中支持（Chrome, Firefox, Edge），建议提供备用格式。

**Q: 如何保留图片的 EXIF 信息？**
A: 当前版本会移除 EXIF 信息，如需保留可联系后端开发者。

---

## 相关资源

- [Sharp.js 官方文档](https://sharp.pixelplumbing.com/)
- [WebP 格式介绍](https://developers.google.com/speed/webp)
- [图片优化最佳实践](https://web.dev/image-optimization/)
