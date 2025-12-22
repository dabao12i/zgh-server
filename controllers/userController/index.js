const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { sequelize } = require('../../config/database')
const codes = require('../../config/codes')
const logger =require('../../config/logger')
const asyncHandler = require('../../middleware/asyncHandler')

const User = sequelize.models.User
const TokenBlacklist = sequelize.models.TokenBlacklist
const RefreshToken = sequelize.models.RefreshToken

/**
 * @description 注册新用户
 * @route POST /api/user/register
 */
const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.cc(null, '用户名和密码不能为空', codes.INVALID_PARAMS)
  }

  const userExists = await User.findOne({ where: { username } })

  if (userExists) {
    return res.cc(null, '用户名已存在', codes.CONFLICT)
  }

  const user = await User.create({
    username,
    password,
  })

  if (user) {
    logger.info(`新用户 ${username} 注册成功。`)
    res.status(201).cc({
      id: user.id,
      username: user.username,
    }, '用户注册成功', codes.CREATED)
  } else {
    logger.error(`用户 ${username} 注册失败。`)
    res.cc(null, '用户注册失败', codes.SERVER_ERROR)
  }
})

/**
 * @description 用户登录
 * @route POST /api/user/login
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.cc(null, '用户名或密码不能为空', codes.INVALID_PARAMS)
  }

  const user = await User.findOne({ where: { username } })

  if (user && (await user.isValidPassword(password))) {
    const jti = uuidv4()
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role || 'user', // 假设默认为 'user' 角色
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      jwtid: jti,
    })

    const refreshToken = await RefreshToken.createToken(user)

    logger.info(`用户 ${username} 登录成功。`)
    res.cc({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }, '登录成功')
  } else {
    logger.warn(`登录尝试失败: ${username}。用户名或密码错误。`)
    res.cc(null, '用户名或密码错误', codes.UNAUTHORIZED)
  }
})

/**
 * @description 用户注销
 * @route POST /api/user/logout
 */
const logout = asyncHandler(async (req, res) => {
  const { jti, exp, id } = req.user
  const expiresAt = new Date(exp * 1000)

  // Blacklist the access token
  await TokenBlacklist.create({
    jti,
    expiresAt,
  })
  
  // Remove the refresh token from the database
  await RefreshToken.destroy({ where: { userId: id } })

  logger.info(`用户 (ID: ${id}) 已注销, access token (jti: ${jti}) 已加入黑名单, refresh token 已删除。`)
  res.cc(null, '注销成功')
})

/**
 * @description 刷新 Access Token
 * @route POST /api/user/refresh-token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: requestToken } = req.body

  if (!requestToken) {
    return res.cc(null, '刷新令牌是必需的', codes.INVALID_PARAMS)
  }

  const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } })

  if (!refreshToken) {
    return res.cc(null, '刷新令牌无效', codes.UNAUTHORIZED)
  }

  if (RefreshToken.verifyExpiration(refreshToken)) {
    RefreshToken.destroy({ where: { id: refreshToken.id } })
    return res.cc(null, '刷新令牌已过期，请重新登录', codes.TOKEN_EXPIRED)
  }

  const user = await User.findByPk(refreshToken.userId)
  if (!user) {
    return res.cc(null, '用户未找到', codes.NOT_FOUND)
  }

  const jti = uuidv4()
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role || 'user',
  }

  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    jwtid: jti,
  })

  logger.info(`用户 (ID: ${user.id}) 刷新了 access token。`)
  res.cc({
    accessToken: newAccessToken,
  }, '令牌刷新成功')
})

/**
 * @description 获取当前用户信息
 * @route GET /api/user/me
 */
const getMe = asyncHandler(async (req, res) => {
  // The user object is attached to the request by the auth middleware
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'username', 'role'], // Specify which attributes to return
  })

  if (!user) {
    return res.cc(null, '用户未找到', codes.NOT_FOUND)
  }

  res.cc(user, '用户信息获取成功')
})


module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
}
