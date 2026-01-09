const asyncHandler = require('../middleware/asyncHandler');
const { sequelize } = require('../config/database');
const { User } = sequelize.models;
const codes = require('../config/codes');
const bcrypt = require('bcryptjs');

// @desc    创建用户
// @route   POST /api/users
// @access  管理员
exports.createUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        const error = new Error('请输入用户名、邮箱和密码');
        error.code = codes.MISSING_PARAMS;
        error.isOperational = true;
        return next(error);
    }

    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });
        
        // 不返回密码
        const user_data = { ...user.toJSON() };
        delete user_data.password;

        res.cc(user_data, '用户创建成功。');
    } catch (error) {
        // 处理潜在的唯一约束错误
        error.code = codes.INVALID_PARAMS;
        next(error);
    }
});

// @desc    获取所有用户
// @route   GET /api/users
// @access  管理员
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });
    res.cc(users, '用户列表获取成功。');
});

// @desc    获取单个用户
// @route   GET /api/users/:id
// @access  管理员
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        const error = new Error('用户未找到。');
        error.code = codes.NOT_FOUND;
        error.isOperational = true;
        return next(error);
    }

    res.cc(user, '用户获取成功。');
});

// @desc    更新用户
// @route   PUT /api/users/:id
// @access  管理员
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        const error = new Error('用户未找到。');
        error.code = codes.NOT_FOUND;
        error.isOperational = true;
        return next(error);
    }

    // 可更新字段
    const { username, email, role } = req.body;

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    try {
        await user.save();
        
        const user_data = { ...user.toJSON() };
        delete user_data.password;

        res.cc(user_data, '用户信息更新成功。');
    } catch (error) {
        // 处理潜在的唯一约束错误
        error.code = codes.INVALID_PARAMS;
        next(error);
    }
});

// @desc    删除用户
// @route   DELETE /api/users/:id
// @access  管理员
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        const error = new Error('用户未找到。');
        error.code = codes.NOT_FOUND;
        error.isOperational = true;
        return next(error);
    }

    await user.destroy();

    res.cc(null, '用户删除成功。');
});
