const asyncHandler = require('../middleware/asyncHandler')
const imageService = require('../utils/imageService')
const logger = require('../config/logger')
const codes = require('../config/codes')

/**
 * 压缩图片
 */
exports.compressImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { quality = '80', format = 'jpeg' } = req.body

  const compressedBuffer = await imageService.compressImage(req.file.buffer, {
    quality: parseInt(quality),
    format,
  })

  res.set('Content-Type', `image/${format}`)
  res.set('Content-Disposition', `attachment; filename="compressed.${format}"`)
  res.send(compressedBuffer)
})

/**
 * 缩放图片
 */
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { width, height, fit = 'cover' } = req.body

  const resizedBuffer = await imageService.resizeImage(req.file.buffer, {
    width: width ? parseInt(width) : null,
    height: height ? parseInt(height) : null,
    fit,
  })

  res.set('Content-Type', 'image/jpeg')
  res.set('Content-Disposition', 'attachment; filename="resized.jpeg"')
  res.send(resizedBuffer)
})

/**
 * 裁剪图片
 */
exports.cropImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { left = 0, top = 0, width, height } = req.body

  if (!width || !height) {
    const error = new Error('缺少必要参数: width 和 height')
    error.code = codes.MISSING_PARAMS
    error.isOperational = true
    return next(error)
  }

  const croppedBuffer = await imageService.cropImage(req.file.buffer, {
    left: parseInt(left),
    top: parseInt(top),
    width: parseInt(width),
    height: parseInt(height),
  })

  res.set('Content-Type', 'image/jpeg')
  res.set('Content-Disposition', 'attachment; filename="cropped.jpeg"')
  res.send(croppedBuffer)
})

/**
 * 转换图片格式
 */
exports.convertFormat = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { format = 'jpeg', quality = '80' } = req.body

  const convertedBuffer = await imageService.convertFormat(req.file.buffer, format, {
    quality: parseInt(quality),
  })

  res.set('Content-Type', `image/${format}`)
  res.set('Content-Disposition', `attachment; filename="converted.${format}"`)
  res.send(convertedBuffer)
})

/**
 * 获取图片元数据
 */
exports.getMetadata = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const metadata = await imageService.getImageMetadata(req.file.buffer)
  res.cc(metadata, '获取图片元数据成功')
})

/**
 * 生成缩略图
 */
exports.generateThumbnail = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { width = '200', height = '200', format = 'jpeg' } = req.body

  const thumbnailBuffer = await imageService.generateThumbnail(req.file.buffer, {
    width: parseInt(width),
    height: parseInt(height),
    format,
  })

  res.set('Content-Type', `image/${format}`)
  res.set('Content-Disposition', `attachment; filename="thumbnail.${format}"`)
  res.send(thumbnailBuffer)
})

/**
 * 添加水印
 */
exports.addWatermark = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { text, fontSize = '40', color = '#FFFFFF', position = 'bottom-right' } = req.body

  if (!text) {
    const error = new Error('缺少必要参数: text (水印文字)')
    error.code = codes.MISSING_PARAMS
    error.isOperational = true
    return next(error)
  }

  const watermarkedBuffer = await imageService.addWatermark(req.file.buffer, text, {
    fontSize: parseInt(fontSize),
    color,
    position,
  })

  res.set('Content-Type', 'image/jpeg')
  res.set('Content-Disposition', 'attachment; filename="watermarked.jpeg"')
  res.send(watermarkedBuffer)
})

/**
 * 旋转图片
 */
exports.rotateImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { angle = '90' } = req.body

  const rotatedBuffer = await imageService.rotateImage(req.file.buffer, parseInt(angle))

  res.set('Content-Type', 'image/jpeg')
  res.set('Content-Disposition', 'attachment; filename="rotated.jpeg"')
  res.send(rotatedBuffer)
})

/**
 * 翻转图片
 */
exports.flipImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }
  const { direction = 'horizontal' } = req.body
  const flippedBuffer = await imageService.flipImage(req.file.buffer, direction)
  res.set('Content-Type', 'image/jpeg')
  res.set('Content-Disposition', 'attachment; filename="flipped.jpeg"')
  res.send(flippedBuffer)
})

/**
 * 批量处理图片
 */
exports.batchProcess = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    const error = new Error('请上传图片文件')
    error.code = codes.FILE_MISSING
    error.isOperational = true
    return next(error)
  }

  const { operations = [] } = req.body

  if (!Array.isArray(operations) || operations.length === 0) {
    const error = new Error('操作数组不能为空')
    error.code = codes.INVALID_PARAMS
    error.isOperational = true
    return next(error)
  }

  const processedBuffer = await imageService.batchProcess(req.file.buffer, operations)

  res.set('Content-Type', 'image/jpeg')
  res.set('Content-Disposition', 'attachment; filename="processed.jpeg"')
  res.send(processedBuffer)
})
