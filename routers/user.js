const express = require('express')
const { login, register, logout, refreshToken, getMe } = require('../controllers/userController') // 导入认证控制器
const auth = require('../middleware/auth') // 导入认证中间件

// 创建路由实例
const router = express.Router()

/**
 * @apiGroup 用户与认证
 * @apiName 用户注册
 * @api {post} /register 用户注册
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 */
router.post('/register', register)

/**
 * @apiGroup 用户与认证
 * @apiName 用户登录
 * @api {post} /login 用户登录
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiSuccess {String} accessToken Access Token
 * @apiSuccess {String} refreshToken Refresh Token
 * @apiSuccess {Object} user 用户信息
 */
router.post('/login', login)

/**
 * @apiGroup 用户与认证
 * @apiName 用户注销
 * @api {post} /logout 用户注销
 * @apiHeader {String} Authorization Bearer Token
 */
router.post('/logout', auth, logout)

/**
 * @apiGroup 用户与认证
 * @apiName 刷新Token
 * @api {post} /refresh-token 刷新 Access Token
 * @apiParam {String} refreshToken Refresh Token
 */
router.post('/refresh-token', refreshToken)

/**
 * @apiGroup 用户与认证
 * @apiName 获取当前用户信息
 * @api {get} /info 获取当前用户信息
 * @apiHeader {String} Authorization Bearer Token
 */
router.get('/info', auth, getMe)

// 导出路由实例
module.exports = router
