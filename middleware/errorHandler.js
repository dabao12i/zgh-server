const logger = require('../config/logger');
const codes = require('../config/codes');

/**
 * 全局错误处理中间件。
 * 捕获所有错误，并发送一个HTTP状态为200的标准化响应。
 */
const errorHandler = (err, req, res, next) => {
  // 记录错误详情
  logger.error(err.message, { stack: err.stack });

  // 检查错误是否已有预定义的业务代码，否则使用通用错误码
  const errorCode = err.code && typeof err.code === 'number' ? err.code : codes.ERROR;
  let errorMessage = '服务器发生了一个意外的错误。';
  let errorData = null;

  if (process.env.NODE_ENV === 'production') {
    // 在生产环境中，只暴露可操作性错误的具体信息
    if (err.isOperational) {
      errorMessage = err.message;
    }
  } else {
    // 在开发环境中，提供详细的错误信息
    errorMessage = err.message;
    errorData = { stack: err.stack };
  }
  
  // 响应中间件期望接收一个预先格式化好的对象
  // 以便我们设置自定义的代码和消息。
  const responsePayload = {
      code: errorCode,
      msg: errorMessage,
      data: errorData
  };

  // 被修改后的 res.send 将会处理这个载荷
  // 并以HTTP 200状态发送。
  res.send(responsePayload);
};

module.exports = errorHandler;
