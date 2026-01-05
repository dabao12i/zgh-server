const logger = require('../config/logger');
const codes = require('../config/codes');

/**
 * 标准化所有API响应的中间件。
 * 它添加了 res.cc 辅助函数，并提供一个统一的响应发送机制。
 * 所有响应的HTTP状态都将是200。实际结果由JSON响应体中的 'code' 字段指示。
 */
const apiResponseHandler = (req, res, next) => {
  // 捕获原始的 Express res.json 方法
  const originalJson = res.json.bind(res);

  /**
   * 辅助函数，用于发送标准化的API响应。
   * 这直接使用原始的 `res.json` 以避免递归。
   */
  const sendStandardResponse = (data, msg = '操作成功', code = codes.SUCCESS) => {
    res.status(200); // 始终将HTTP状态设置为200

    const responseBody = {
      code: code,
      msg: msg,
      data: data || null,
    };
    
    // 使用捕获的原始 res.json 发送响应。
    originalJson(responseBody);
  };

  /**
   * 发送成功响应的便捷方法。
   * 这将使用我们的 `sendStandardResponse` 辅助函数。
   */
  res.cc = function(data, msg = '操作成功') {
    sendStandardResponse(data, msg, codes.SUCCESS);
  };

  // 临时地将 sendStandardResponse 辅助函数附加到 res 对象上，
  // 这样错误处理器 (errorHandler) 就可以使用它来发送格式化的错误响应。
  res._sendStandardResponse = sendStandardResponse;

  next();
};

module.exports = apiResponseHandler;