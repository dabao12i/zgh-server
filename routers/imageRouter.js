const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');

const router = express.Router();

// 配置 multer 用于图片上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只支持图片文件格式：jpeg, png, webp, gif, tiff'), false);
    }
  }
});

/**
 * @api {post} /api/images/compress 压缩图片
 * @apiName 压缩图片
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {Number} [quality=80] 压缩质量 (1-100)
 * @apiParam {String} [format=jpeg] 输出格式 (jpeg, png, webp)
 * @apiSuccess {Buffer} 压缩后的图片
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/compress \
 *     -F "file=@image.jpg" \
 *     -F "quality=60" \
 *     -F "format=webp"
 */
router.post('/compress', upload.single('file'), imageController.compressImage);

/**
 * @api {post} /api/images/resize 缩放图片
 * @apiName 缩放图片
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {Number} width 目标宽度 (像素)
 * @apiParam {Number} height 目标高度 (像素)
 * @apiParam {String} [fit=cover] 适应方式 (cover, contain, fill, inside, outside)
 * @apiSuccess {Buffer} 缩放后的图片
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/resize \
 *     -F "file=@image.jpg" \
 *     -F "width=500" \
 *     -F "height=500" \
 *     -F "fit=cover"
 */
router.post('/resize', upload.single('file'), imageController.resizeImage);

/**
 * @api {post} /api/images/crop 裁剪图片
 * @apiName 裁剪图片
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {Number} [left=0] 左边距 (像素)
 * @apiParam {Number} [top=0] 顶部距离 (像素)
 * @apiParam {Number} width 裁剪宽度 (像素)
 * @apiParam {Number} height 裁剪高度 (像素)
 * @apiSuccess {Buffer} 裁剪后的图片
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/crop \
 *     -F "file=@image.jpg" \
 *     -F "left=100" \
 *     -F "top=100" \
 *     -F "width=200" \
 *     -F "height=200"
 */
router.post('/crop', upload.single('file'), imageController.cropImage);

/**
 * @api {post} /api/images/convert 转换图片格式
 * @apiName 转换图片格式
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {String} format 目标格式 (jpeg, png, webp, gif, tiff)
 * @apiParam {Number} [quality=80] 质量 (1-100, 仅对 jpeg/webp 有效)
 * @apiSuccess {Buffer} 转换后的图片
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/convert \
 *     -F "file=@image.jpg" \
 *     -F "format=png"
 */
router.post('/convert', upload.single('file'), imageController.convertFormat);

/**
 * @api {post} /api/images/metadata 获取图片元数据
 * @apiName 获取图片元数据
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiSuccess {Object} metadata 图片元数据 (宽度、高度、格式、色彩空间等)
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/metadata \
 *     -F "file=@image.jpg"
 */
router.post('/metadata', upload.single('file'), imageController.getMetadata);

/**
 * @api {post} /api/images/thumbnail 生成缩略图
 * @apiName 生成缩略图
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {Number} [width=200] 缩略图宽度 (像素)
 * @apiParam {Number} [height=200] 缩略图高度 (像素)
 * @apiParam {String} [format=jpeg] 输出格式 (jpeg, png, webp)
 * @apiSuccess {Buffer} 缩略图
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/thumbnail \
 *     -F "file=@image.jpg" \
 *     -F "width=100" \
 *     -F "height=100"
 */
router.post('/thumbnail', upload.single('file'), imageController.generateThumbnail);

/**
 * @api {post} /api/images/watermark 添加水印
 * @apiName 添加水印
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {String} text 水印文字
 * @apiParam {Number} [fontSize=40] 字体大小
 * @apiParam {String} [color=#FFFFFF] 文字颜色 (十六进制)
 * @apiParam {String} [position=bottom-right] 位置 (top-left, top-right, bottom-left, bottom-right, center)
 * @apiSuccess {Buffer} 添加水印后的图片
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/watermark \
 *     -F "file=@image.jpg" \
 *     -F "text=Copyright © 2024" \
 *     -F "fontSize=30" \
 *     -F "color=#FF0000" \
 *     -F "position=bottom-right"
 */
router.post('/watermark', upload.single('file'), imageController.addWatermark);

/**
 * @api {post} /api/images/rotate 旋转图片
 * @apiName 旋转图片
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {Number} [angle=90] 旋转角度 (0, 90, 180, 270, -90, -180, -270)
 * @apiSuccess {Buffer} 旋转后的图片
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/rotate \
 *     -F "file=@image.jpg" \
 *     -F "angle=90"
 */
router.post('/rotate', upload.single('file'), imageController.rotateImage);

/**
 * @api {post} /api/images/flip 翻转图片
 * @apiName 翻转图片
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {String} [direction=horizontal] 翻转方向 (horizontal, vertical)
 * @apiSuccess {Buffer} 翻转后的图片
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/flip \
 *     -F "file=@image.jpg" \
 *     -F "direction=horizontal"
 */
router.post('/flip', upload.single('file'), imageController.flipImage);

/**
 * @api {post} /api/images/batch 批量处理图片
 * @apiName 批量处理图片
 * @apiGroup 图片处理
 * @apiParam {File} file 图片文件
 * @apiParam {Array} operations 操作数组，每个操作包含 type 和 options
 * @apiSuccess {Buffer} 处理后的图片
 * @apiExample {json} 操作数组示例:
 *   {
 *     "operations": [
 *       { "type": "resize", "options": { "width": 800, "height": 600 } },
 *       { "type": "compress", "options": { "quality": 75, "format": "jpeg" } },
 *       { "type": "watermark", "options": { "text": "Copyright" } }
 *     ]
 *   }
 * @apiExample {curl} 使用示例:
 *   curl -X POST \
 *     http://localhost:3000/api/images/batch \
 *     -F "file=@image.jpg" \
 *     -F "operations=[{\"type\":\"resize\",\"options\":{\"width\":800,\"height\":600}},{\"type\":\"compress\",\"options\":{\"quality\":75}}]"
 */
router.post('/batch', upload.single('file'), imageController.batchProcess);

module.exports = router;
