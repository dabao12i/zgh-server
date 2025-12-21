const jwt = require('jsonwebtoken');
const codes = require('../config/codes');
const logger = require('../config/logger');

/**
 * JWT 认证中间件
 * 验证请求头中的 token，并将解码后的用户信息附加到 req.user
 */
const auth = (req, res, next) => {
  // 从请求头中获取 token
  // 格式通常是 "Bearer TOKEN"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('未提供或格式不正确的认证头');
    // 使用 res.send 返回统一格式的错误响应
    return res.send(null, '访问未经授权，请提供有效的Token', codes.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 将解码后的用户信息附加到 req.user
    logger.info(`Token 验证成功，用户ID: ${req.user.id}`);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token 已过期');
      return res.send(null, 'Token 已过期，请重新登录', codes.TOKEN_EXPIRED);
    }
    logger.error(`Token 验证失败: ${error.message}`);
    return res.send(null, '无效的 Token，请重新登录', codes.UNAUTHORIZED);
  }
};

module.exports = auth;
