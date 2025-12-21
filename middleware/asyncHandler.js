/**
 * @description 一个高阶函数，用于包装异步的路由处理器，自动捕获并处理异常。
 * @param {Function} fn - 异步的路由处理器函数。
 * @returns {Function} - 一个新的路由处理器函数，内部包含 try...catch 逻辑。
 */
const asyncHandler = (fn) => (req, res, next) => {
  // 确保 fn 的执行结果是一个 Promise
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
