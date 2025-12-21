const codes = require('../config/codes');

/**
 * 标准化所有API响应的中间件。
 * 它封装了原始的 res.send 方法，并添加了 res.cc 辅助函数。
 * 所有响应的HTTP状态都将是200。实际结果由JSON响应体中的 'code' 字段指示。
 */
const apiResponseHandler = (req, res, next) => {
  // 保存原始的 res.send 方法
  const originalSend = res.send.bind(res);

  /**
   * 自定义的、底层的响应方法。
   * @param {any} data - 响应的有效载荷/数据。
   * @param {string} [msg='操作成功'] - 描述性消息。
   * @param {number} [code=0] - 自定义状态码 (来自 config/codes.js)。
   */
  res.send = (data, msg = '操作成功', code = codes.SUCCESS) => {
    // 始终将HTTP状态设置为200
    res.status(200);

    // 如果 data 参数本身就是一个已经构建好的完整响应体，则直接发送
    // 这主要用于 errorHandler。
    if (typeof data === 'object' && data !== null && data.hasOwnProperty('code')) {
      return originalSend(data);
    }
    
    // 构建标准响应体
    const responseBody = {
      code,
      msg,
      data: data || null,
    };

    originalSend(responseBody);
  };

  /**
   * 发送成功响应的便捷方法。
   * @param {any} data - 要发送的数据。
   * @param {string} [msg='操作成功'] - 成功时的消息。
   */
  res.cc = function(data, msg = '操作成功') {
    // `this` 指向 `res` 对象, 调用被重写过的 `send` 方法
    this.send(data, msg, codes.SUCCESS);
  }

  next();
};

module.exports = apiResponseHandler;