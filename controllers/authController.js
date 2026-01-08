const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const codes = require('../config/codes')
const logger = require('../config/logger')
const asyncHandler = require('../middleware/asyncHandler')
const { User } = require('../config/database').models // Import User model

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body

  // 1. Validate input
  if (!username || !password) {
    const error = new Error('Please enter all required fields: username, email, password')
    error.code = codes.INVALID_PARAMS
    error.isOperational = true
    return next(error)
  }

  // 2. Check if user already exists
  let user = await User.findOne({ where: { username } })
  if (user) {
    const error = new Error('用户名已经注册')
    error.code = codes.CONFLICT // Use a more specific code for conflict
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

  // 3. Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // 4. Create new user
  user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || 'user', // Default role to 'user' if not provided
  })

  // 5. Generate token (optional for registration, but good for immediate login)
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  logger.info(`New user registered: ${username}`)
  res.cc({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } }, 'User registered successfully')
})

// @desc    Authenticate user & get token
// @route   POST /api/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body

  // 1. Validate input
  if (!username || !password) {
    const error = new Error('Please enter username and password')
    error.code = codes.INVALID_PARAMS
    error.isOperational = true
    return next(error)
  }

  // 2. Check for user in database
  const user = await User.findOne({ where: { username } })

  if (!user) {
    const error = new Error('请填写用户名')
    error.code = codes.UNAUTHORIZED
    error.isOperational = true
    return next(error)
  }

  // 3. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    const error = new Error('密码错误')
    error.code = codes.UNAUTHORIZED
    error.isOperational = true
    return next(error)
  }

  // 4. Generate JWT Token
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  logger.info(`User ${username} logged in successfully, token issued.`)
  res.cc({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } }, 'Login successful')
})

module.exports = {
  login,
  register,
}
