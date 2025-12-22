const jwt = require('jsonwebtoken')
const { sequelize } = require('../config/database')
const codes = require('../config/codes')
const logger = require('../config/logger')
const asyncHandler = require('./asyncHandler')

const TokenBlacklist = sequelize.models.TokenBlacklist

/**
 * JWT 认证中间件
 * 验证请求头中的 token，检查黑名单，并将解码后的用户信息附加到 req.user
 */
const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('未提供或格式不正确的认证头')
    return res.cc(null, '访问未经授权，请提供有效的Token', codes.UNAUTHORIZED)
  }

  const token = authHeader.split(' ')[1]

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false, // 确保 jwt.verify 检查过期
    })

    // 检查 token 是否在黑名单中
    const blacklistedToken = await TokenBlacklist.findOne({
      where: { jti: decoded.jti },
    })

    if (blacklistedToken) {
      logger.warn(`认证失败，Token (jti: ${decoded.jti}) 已被加入黑名单。`)
      return res.cc(null, '会话已过期，请重新登录', codes.UNAUTHORIZED)
    }

    req.user = decoded // 将解码后的用户信息附加到 req.user
    logger.info(`Token 验证成功，用户ID: ${req.user.id}`)
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token 已过期')
      return res.cc(null, 'Token 已过期，请重新登录', codes.TOKEN_EXPIRED)
    }
    logger.error(`Token 验证失败: ${error.message}`)
    return res.cc(null, '无效的 Token，请重新登录', codes.UNAUTHORIZED)
  }
})

module.exports = auth
