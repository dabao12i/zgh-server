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
  
  // 在生产环境中，只暴露可操作性错误的具体信息
  if (process.env.NODE_ENV === 'production' && err.isOperational) {
    errorMessage = err.message;
  }
  
  // 在开发环境中，暴露更详细的错误信息
  if (process.env.NODE_ENV !== 'production') {
    errorMessage = err.message;
  }
  
  // 响应中间件期望接收一个预先格式化好的对象
  // 以便我们设置自定义的代码和消息。
  // 注意：我们不再将 err.stack 发送回客户端以避免 RangeError 循环。
  const responsePayload = {
      code: errorCode,
      msg: errorMessage,
      data: null
  };

  // 使用 apiResponseHandler 中暴露的新辅助函数发送响应
  if (res._sendStandardResponse) {
    res._sendStandardResponse(responsePayload.data, responsePayload.msg, responsePayload.code);
  } else {
    // 回退机制，以防 _sendStandardResponse 不可用
    // 这不应该发生，如果中间件顺序正确的话。
    res.status(200).json(responsePayload);
  }
};

module.exports = errorHandler;
