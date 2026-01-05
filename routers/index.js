const express = require('express');
const { login } = require('../controllers/authController'); // 导入认证控制器
const auth = require('../middleware/auth'); // 导入认证中间件
const asyncHandler = require('../middleware/asyncHandler'); // 导入异步错误处理包装器

// 创建路由实例
const router = express.Router();

/**
 * @apiGroup 认证
 * @apiName 用户登录
 * @api {post} /login 用户登录
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiSuccess {String} token JWT Token
 * @apiSuccess {Object} user 用户信息
 */
router.post('/login', login);

/**
 * @apiGroup 认证
 * @apiName 受保护的资源
 * @api {get} /protected 受保护的资源
 * @apiHeader {String} Authorization "Bearer &lt;token&gt;"
 * @apiSuccess {String} message 成功消息
 * @apiSuccess {Object} user 用户信息
 */
router.get('/protected', auth, asyncHandler(async (req, res) => {
  // 只有通过认证的用户才能访问到这里
  // req.user 包含了认证中间件附加的用户信息
  res.cc({ message: `欢迎，用户ID: ${req.user.id}，您已访问受保护的资源！`, user: req.user }, '访问受保护资源成功');
}));

// 文件上传相关路由
const fileRouter = require('./fileRouter');
router.use('/files', fileRouter);

// 用户管理相关路由
const userRouter = require('./userRouter');
router.use('/users', userRouter);

// 导出路由实例
module.exports = router;
