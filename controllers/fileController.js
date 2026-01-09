const asyncHandler = require('../middleware/asyncHandler');
const codes = require('../config/codes');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// @desc    上传文件
// @route   POST /api/files/upload
// @access  公开
exports.uploadFile = asyncHandler(async (req, res, next) => {
    // 'upload' 中间件现在在此控制器之前运行。
    // 它处理错误并填充 req.file。
    if (req.file === undefined) {
        const error = new Error('请选择要上传的文件。');
        error.code = codes.MISSING_PARAMS;
        error.isOperational = true;
        return next(error);
    }

    const fileData = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`
    };

    res.cc(fileData, '文件上传成功。');
});

// @desc    使用 Sharp 处理图片
// @route   POST /api/files/process-sharp
// @access  公开
exports.processImageWithSharp = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        const error = new Error('请上传一个图片文件。');
        error.code = codes.MISSING_PARAMS;
        error.isOperational = true;
        return next(error);
    }

    const originalName = path.parse(req.file.originalname).name;
    const newFilename = `${originalName}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, '..', 'uploads', newFilename);

    await sharp(req.file.buffer)
        .resize(800) // 调整宽度为 800px，高度自动缩放
        .webp({ quality: 80 }) // 转换为 80% 质量的 webp
        .toFile(outputPath);

    const fileData = {
        filename: newFilename,
        path: outputPath,
        url: `/uploads/${newFilename}`
    };

    res.cc(fileData, '图片处理并保存成功。');
});


// @desc    删除文件
// @route   DELETE /api/files/:filename
// @access  公开
exports.deleteFile = asyncHandler(async (req, res, next) => {
    const filename = req.params.filename;
    // 基本验证，防止路径遍历
    if (!filename || filename.includes('..') || filename.includes(path.sep)) {
        const error = new Error('无效的文件名。');
        error.code = codes.INVALID_PARAMS;
        error.isOperational = true;
        return next(error);
    }

    const filePath = path.join(__dirname, '..', 'uploads', filename);

    try {
        await fs.access(filePath); // 检查文件是否存在（不存在则抛出异常）
    } catch (error) {
        const notFoundError = new Error('文件未找到。');
        notFoundError.code = codes.NOT_FOUND;
        notFoundError.isOperational = true;
        return next(notFoundError);
    }

    try {
        await fs.unlink(filePath);
        res.cc({ filename }, '文件删除成功。');
    } catch (err) {
        const deleteError = new Error('无法删除该文件。');
        deleteError.code = codes.SERVER_ERROR;
        // 让默认的错误处理器记录原始的错误堆栈
        return next(deleteError);
    }
});
