const express = require('express')
const { login } = require('../controllers/userController') // 导入认证控制器

// 创建路由实例
const router = express.Router()

/**
 * @apiGroup 认证
 * @apiName 用户登录
 * @api {post} /login 用户登录
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiSuccess {String} token JWT Token
 * @apiSuccess {Object} user 用户信息
 */
router.post('/login', login)

// 导出路由实例
module.exports = router
