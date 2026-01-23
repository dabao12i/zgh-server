const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

/**
 * 图片处理服务
 * 提供图片压缩、缩放、裁剪、格式转换等功能
 */

/**
 * 压缩图片
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {Object} options - 压缩选项
 * @param {number} options.quality - 图片质量 (1-100)
 * @param {string} options.format - 输出格式 (jpeg, png, webp, etc)
 * @returns {Promise<Buffer>} 压缩后的图片buffer
 */
async function compressImage(imageBuffer, options = {}) {
  try {
    const { quality = 80, format = 'jpeg' } = options;
    
    let transformer = sharp(imageBuffer);
    
    if (format === 'jpeg') {
      transformer = transformer.jpeg({ quality, progressive: true });
    } else if (format === 'png') {
      transformer = transformer.png({ quality, compressionLevel: 9 });
    } else if (format === 'webp') {
      transformer = transformer.webp({ quality });
    }
    
    const compressedBuffer = await transformer.toBuffer();
    logger.info(`图片压缩成功，质量: ${quality}, 格式: ${format}`);
    return compressedBuffer;
  } catch (error) {
    logger.error('图片压缩失败:', error.message);
    throw new Error(`图片压缩失败: ${error.message}`);
  }
}

/**
 * 缩放图片
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {Object} options - 缩放选项
 * @param {number} options.width - 目标宽度
 * @param {number} options.height - 目标高度
 * @param {string} options.fit - 适应方式 (cover, contain, fill, inside, outside)
 * @returns {Promise<Buffer>} 缩放后的图片buffer
 */
async function resizeImage(imageBuffer, options = {}) {
  try {
    const { width, height, fit = 'cover' } = options;
    
    if (!width && !height) {
      throw new Error('必须指定宽度或高度');
    }
    
    const resizedBuffer = await sharp(imageBuffer)
      .resize(width, height, { fit, withoutEnlargement: true })
      .toBuffer();
    
    logger.info(`图片缩放成功，尺寸: ${width}x${height}`);
    return resizedBuffer;
  } catch (error) {
    logger.error('图片缩放失败:', error.message);
    throw new Error(`图片缩放失败: ${error.message}`);
  }
}

/**
 * 裁剪图片
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {Object} options - 裁剪选项
 * @param {number} options.left - 左边距
 * @param {number} options.top - 顶部距离
 * @param {number} options.width - 裁剪宽度
 * @param {number} options.height - 裁剪高度
 * @returns {Promise<Buffer>} 裁剪后的图片buffer
 */
async function cropImage(imageBuffer, options = {}) {
  try {
    const { left = 0, top = 0, width, height } = options;
    
    if (!width || !height) {
      throw new Error('必须指定裁剪的宽度和高度');
    }
    
    const croppedBuffer = await sharp(imageBuffer)
      .extract({ left, top, width, height })
      .toBuffer();
    
    logger.info(`图片裁剪成功，尺寸: ${width}x${height}`);
    return croppedBuffer;
  } catch (error) {
    logger.error('图片裁剪失败:', error.message);
    throw new Error(`图片裁剪失败: ${error.message}`);
  }
}

/**
 * 转换图片格式
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {string} format - 目标格式 (jpeg, png, webp, gif, tiff)
 * @param {Object} options - 格式特定选项
 * @returns {Promise<Buffer>} 转换后的图片buffer
 */
async function convertFormat(imageBuffer, format = 'jpeg', options = {}) {
  try {
    let transformer = sharp(imageBuffer);
    
    switch (format.toLowerCase()) {
      case 'jpeg':
        transformer = transformer.jpeg({ quality: options.quality || 80 });
        break;
      case 'png':
        transformer = transformer.png({ compressionLevel: 9 });
        break;
      case 'webp':
        transformer = transformer.webp({ quality: options.quality || 80 });
        break;
      case 'gif':
        transformer = transformer.gif();
        break;
      case 'tiff':
        transformer = transformer.tiff();
        break;
      default:
        throw new Error(`不支持的格式: ${format}`);
    }
    
    const convertedBuffer = await transformer.toBuffer();
    logger.info(`图片格式转换成功，目标格式: ${format}`);
    return convertedBuffer;
  } catch (error) {
    logger.error('图片格式转换失败:', error.message);
    throw new Error(`图片格式转换失败: ${error.message}`);
  }
}

/**
 * 获取图片元数据
 * @param {Buffer} imageBuffer - 图片buffer
 * @returns {Promise<Object>} 图片元数据 (宽度、高度、格式等)
 */
async function getImageMetadata(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    logger.info('获取图片元数据成功');
    return metadata;
  } catch (error) {
    logger.error('获取图片元数据失败:', error.message);
    throw new Error(`获取图片元数据失败: ${error.message}`);
  }
}

/**
 * 生成图片缩略图
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {Object} options - 缩略图选项
 * @param {number} options.width - 缩略图宽度
 * @param {number} options.height - 缩略图高度
 * @param {string} options.format - 输出格式
 * @returns {Promise<Buffer>} 缩略图buffer
 */
async function generateThumbnail(imageBuffer, options = {}) {
  try {
    const { width = 200, height = 200, format = 'jpeg' } = options;
    
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(width, height, { fit: 'cover' })
      .toFormat(format)
      .toBuffer();
    
    logger.info(`生成缩略图成功，尺寸: ${width}x${height}`);
    return thumbnailBuffer;
  } catch (error) {
    logger.error('生成缩略图失败:', error.message);
    throw new Error(`生成缩略图失败: ${error.message}`);
  }
}

/**
 * 添加水印文字到图片
 * @param {Buffer} imageBuffer - 原始图片buffer
 * @param {string} text - 水印文字
 * @param {Object} options - 水印选项
 * @param {number} options.fontSize - 字体大小
 * @param {string} options.color - 文字颜色 (hex format)
 * @param {string} options.position - 位置 (top-left, top-right, bottom-left, bottom-right, center)
 * @returns {Promise<Buffer>} 添加水印后的图片buffer
 */
async function addWatermark(imageBuffer, text, options = {}) {
  try {
    const { fontSize = 40, color = '#FFFFFF', position = 'bottom-right' } = options;
    
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;
    
    // 计算水印位置
    let x = 10, y = 10;
    if (position === 'top-right') {
      x = width - 150;
    } else if (position === 'bottom-left') {
      y = height - 50;
    } else if (position === 'bottom-right') {
      x = width - 150;
      y = height - 50;
    } else if (position === 'center') {
      x = width / 2 - 75;
      y = height / 2 - 20;
    }
    
    // 创建 SVG 水印
    const svgText = Buffer.from(`
      <svg width="${width}" height="${height}">
        <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}" font-weight="bold">
          ${text}
        </text>
      </svg>
    `);
    
    const watermarkedBuffer = await sharp(imageBuffer)
      .composite([{ input: svgText, gravity: 'southeast' }])
      .toBuffer();
    
    logger.info(`添加水印成功，文字: ${text}`);
    return watermarkedBuffer;
  } catch (error) {
    logger.error('添加水印失败:', error.message);
    throw new Error(`添加水印失败: ${error.message}`);
  }
}

/**
 * 旋转图片
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {number} angle - 旋转角度 (0, 90, 180, 270 或 -90, -180, -270)
 * @returns {Promise<Buffer>} 旋转后的图片buffer
 */
async function rotateImage(imageBuffer, angle = 90) {
  try {
    const rotatedBuffer = await sharp(imageBuffer)
      .rotate(angle)
      .toBuffer();
    
    logger.info(`图片旋转成功，角度: ${angle}°`);
    return rotatedBuffer;
  } catch (error) {
    logger.error('图片旋转失败:', error.message);
    throw new Error(`图片旋转失败: ${error.message}`);
  }
}

/**
 * 翻转图片
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {string} direction - 翻转方向 (horizontal 或 vertical)
 * @returns {Promise<Buffer>} 翻转后的图片buffer
 */
async function flipImage(imageBuffer, direction = 'horizontal') {
  try {
    let transformer = sharp(imageBuffer);
    
    if (direction === 'horizontal') {
      transformer = transformer.flop();
    } else if (direction === 'vertical') {
      transformer = transformer.flip();
    } else {
      throw new Error('不支持的翻转方向');
    }
    
    const flippedBuffer = await transformer.toBuffer();
    logger.info(`图片翻转成功，方向: ${direction}`);
    return flippedBuffer;
  } catch (error) {
    logger.error('图片翻转失败:', error.message);
    throw new Error(`图片翻转失败: ${error.message}`);
  }
}

/**
 * 批量处理图片
 * @param {Buffer} imageBuffer - 图片buffer
 * @param {Array} operations - 操作数组，每个操作包含 {type, options}
 * @returns {Promise<Buffer>} 处理后的图片buffer
 */
async function batchProcess(imageBuffer, operations = []) {
  try {
    let result = imageBuffer;
    
    for (const operation of operations) {
      const { type, options } = operation;
      
      switch (type) {
        case 'compress':
          result = await compressImage(result, options);
          break;
        case 'resize':
          result = await resizeImage(result, options);
          break;
        case 'crop':
          result = await cropImage(result, options);
          break;
        case 'convert':
          result = await convertFormat(result, options.format, options);
          break;
        case 'rotate':
          result = await rotateImage(result, options.angle);
          break;
        case 'flip':
          result = await flipImage(result, options.direction);
          break;
        default:
          logger.warn(`未知的操作类型: ${type}`);
      }
    }
    
    logger.info('批量处理图片成功');
    return result;
  } catch (error) {
    logger.error('批量处理图片失败:', error.message);
    throw new Error(`批量处理图片失败: ${error.message}`);
  }
}

module.exports = {
  compressImage,
  resizeImage,
  cropImage,
  convertFormat,
  getImageMetadata,
  generateThumbnail,
  addWatermark,
  rotateImage,
  flipImage,
  batchProcess,
};
