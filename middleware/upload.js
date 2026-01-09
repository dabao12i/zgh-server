const multer = require('multer');
const path = require('path');

// 设置存储引擎
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// 初始化上传设置
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 限制文件大小为10MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file'); // 'file' 是表单字段的名称

// 检查文件类型
function checkFileType(file, cb) {
    // 允许的扩展名
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    // 检查扩展名
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // 检查MIME类型
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('错误：只允许上传图片、PDF和文档文件！');
    }
}

module.exports = upload;
