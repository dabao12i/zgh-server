/**
 * @description API 响应状态码配置文件
 * 该文件定义了API响应中 `code` 字段的所有可能值。
 * 0: 表示成功
 * 负数: 表示系统级、不可恢复的错误
 * 正数 (通常 > 1000): 表示业务级、可预期的错误
 */
const codes = {
  // ================== 成功 ==================
  SUCCESS: 200,

  // ================== 系统级错误 (负数) ==================
  ERROR: -1, // 通用未知错误
  SERVER_ERROR: 500, // 服务器内部错误

  // ================== 业务级错误 (正数) ==================

  // 1xxx: 通用参数类错误
  INVALID_PARAMS: 1001, // 无效的参数
  MISSING_PARAMS: 1002, // 缺少必要参数
  FILE_MISSING: 1003, // 文件缺失
  FILE_TOO_LARGE: 1004, // 文件过大
  UNSUPPORTED_FORMAT: 1005, // 不支持的格式

  // 2xxx: 资源类错误
  NOT_FOUND: 2001, // 请求的资源不存在

  // 3xxx: 图片处理错误
  IMAGE_PROCESS_ERROR: 3001, // 图片处理失败

  // 4xxx: 认证与授权类错误
  UNAUTHORIZED: 401, // 未经授权的访问
  TOKEN_EXPIRED: 402, // 令牌已过期
  FORBIDDEN: 403, // 禁止访问
}

module.exports = codes
