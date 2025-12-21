const jwt = require('jsonwebtoken');
const codes = require('../config/codes');
const logger = require('../config/logger');

/**
 * @description 认证控制器
 */
const login = (req, res) => {
  // 实际应用中，这里会验证用户名和密码
  // 为了示例，我们假设用户验证成功
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send(null, '用户名或密码不能为空', codes.INVALID_PARAMS);
  }

  // 假设用户ID为1，角色为admin
  // 在实际项目中，这里会根据数据库查询结果获取用户信息
  if (username === 'testuser' && password === 'testpass') {
    const user = {
      id: 1,
      username: 'testuser',
      role: 'admin',
    };

    // 生成 JWT Token
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    logger.info(`用户 ${username} 登录成功，颁发 Token。`);
    return res.cc({ token, user: { id: user.id, username: user.username, role: user.role } }, '登录成功');
  } else {
    logger.warn(`用户 ${username} 登录失败：用户名或密码错误。`);
    return res.send(null, '用户名或密码错误', codes.UNAUTHORIZED);
  }
};

module.exports = {
  login,
};
