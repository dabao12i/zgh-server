const winston = require('winston');

const { combine, timestamp, printf, colorize, align, json } = winston.format;

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    // 对于错误，包含堆栈跟踪
    return `${timestamp} ${level}: ${message}\n${stack}`;
  }
  return `${timestamp} ${level}: ${message}`;
});

// 开发环境日志记录器
const developmentLogger = winston.createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [new winston.transports.Console()],
});

// 生产环境日志记录器
const productionLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
});

// 根据环境决定使用哪个日志记录器
const logger = process.env.NODE_ENV === 'development' ? developmentLogger : productionLogger;

// 如果在生产环境中logs目录不存在，则创建它
if (process.env.NODE_ENV !== 'development') {
    const fs = require('fs');
    const path = require('path');
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
}


module.exports = logger;
