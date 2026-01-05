const asyncHandler = require('../middleware/asyncHandler');
const { sequelize } = require('../config/database');
const { User } = sequelize.models;
const codes = require('../config/codes');
const bcrypt = require('bcryptjs');

// @desc    Create user
// @route   POST /api/users
// @access  Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        const error = new Error('Please provide username, email, and password');
        error.code = codes.MISSING_PARAMS;
        error.isOperational = true;
        return next(error);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });
        
        // Don't send password back
        const user_data = { ...user.toJSON() };
        delete user_data.password;

        res.cc(user_data, 'User created successfully');
    } catch (error) {
        // Handle potential unique constraint errors
        error.code = codes.INVALID_PARAMS;
        next(error);
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });
    res.cc(users);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        const error = new Error('User not found');
        error.code = codes.NOT_FOUND;
        error.isOperational = true;
        return next(error);
    }

    res.cc(user);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        const error = new Error('User not found');
        error.code = codes.NOT_FOUND;
        error.isOperational = true;
        return next(error);
    }

    // Fields that can be updated
    const { username, email, role } = req.body;

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    try {
        await user.save();
        
        const user_data = { ...user.toJSON() };
        delete user_data.password;

        res.cc(user_data, 'User updated successfully');
    } catch (error) {
        // Handle potential unique constraint errors
        error.code = codes.INVALID_PARAMS;
        next(error);
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        const error = new Error('User not found');
        error.code = codes.NOT_FOUND;
        error.isOperational = true;
        return next(error);
    }

    await user.destroy();

    res.cc(null, 'User deleted successfully');
});
