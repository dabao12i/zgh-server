const codes = require('../config/codes');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error('Forbidden: You do not have permission to access this resource.');
      error.code = codes.FORBIDDEN;
      error.isOperational = true;
      return next(error);
    }
    next();
  };
};

module.exports = authorize;
