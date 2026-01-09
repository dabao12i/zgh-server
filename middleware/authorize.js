const codes = require('../config/codes');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error('无权访问：您没有权限访问此资源。');
      error.code = codes.FORBIDDEN;
      error.isOperational = true;
      return next(error);
    }
    next();
  };
};

module.exports = authorize;
