const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const codes = require('../config/codes')
const logger = require('../config/logger')
const asyncHandler = require('../middleware/asyncHandler')
const { User } = require('../config/database').models // Import User model

// @desc    注册新用户
// @route   POST /api/register
// @access  公开
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body

  // 1. 验证输入
  if (!username || !password) {
    const error = new Error('请输入所有必填字段：用户名和密码')
    error.code = codes.INVALID_PARAMS
    error.isOperational = true
    return next(error)
  }

  // 2. 检查用户是否存在
  let user = await User.findOne({ where: { username } })
  if (user) {
    const error = new Error('用户名已经注册')
    error.code = codes.CONFLICT // 使用更具体的冲突代码
    error.isOperational = true
    return next(error)
  }
  if (email) {
    user = await User.findOne({ where: { email } })
    if (user) {
      const error = new Error('邮箱已经注册')
      error.code = codes.CONFLICT
      error.isOperational = true
      return next(error)
    }
  }

  // 3. 哈希密码
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // 4. 创建新用户
  user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || 'user', // 如果未提供，则默认为 'user' 角色
  })

  // 5. 生成令牌 (注册时可选，但有助于立即登录)
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  logger.info(`新用户注册: ${username}`)
  res.cc({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } }, '用户注册成功。')
})

// @desc    用户认证并获取令牌
// @route   POST /api/login
// @access  公开
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body

  // 1. 验证输入
  if (!username || !password) {
    const error = new Error('请输入用户名和密码。')
    error.code = codes.INVALID_PARAMS
    error.isOperational = true
    return next(error)
  }

  // 2. 检查数据库中的用户
  const user = await User.findOne({ where: { username } })

  if (!user) {
    const error = new Error('请填写用户名')
    error.code = codes.UNAUTHORIZED
    error.isOperational = true
    return next(error)
  }

  // 3. 比较密码
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    const error = new Error('密码错误')
    error.code = codes.UNAUTHORIZED
    error.isOperational = true
    return next(error)
  }

  // 4. 生成 JWT 令牌
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  logger.info(`用户 ${username} 登录成功，令牌已签发。`)
  res.cc({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } }, '登录成功。')
})

module.exports = {
  login,
  register,
}
