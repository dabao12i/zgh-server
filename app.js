const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
// 加载特定环境的 .env 文件
const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
dotenv.config({ path: envPath })

const apiResponseHandler = require('./utils/responseHandler')
const logger = require('./config/logger')
const errorHandler = require('./middleware/errorHandler')
const asyncHandler = require('./middleware/asyncHandler')
const { connectDB, initializeDatabase } = require('./config/database'); // Import database functions
const initDb = require('./utils/init_db'); // Import initDb utility

// 创建一个 Express 应用
const app = express()
// 跨域处理
app.use(cors())
// 中间件 (这里的顺序很重要，apiResponseHandler 应该在普通路由和控制器之前)
app.use(apiResponseHandler) // 添加我们的自定义响应处理器

// 简单的请求日志记录器中间件
app.use((req, res, next) => {
  logger.info(`收到请求: ${req.method} ${req.originalUrl}`)
  next()
})

// 定义一个简单的根路由来演示统一响应
app.get('/', (req, res) => {
  // 使用新的 res.cc(data, msg) 便捷方法
  res.cc({ info: '欢迎使用 API!' })
})

// 开放 'uploads' 目录作为静态资源
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 导入并注册 API 路由模块
const apiRouter = require('./routers/index')
app.use('/api', apiRouter)

// 全局错误处理器 - 必须是最后一个中间件
app.use(errorHandler)

// 从环境变量获取端口，并提供一个默认值
const PORT = process.env.PORT || 3000

// 启动服务器
const startServer = async () => {
  await initDb(); // Ensure database exists and is initialized
  await connectDB(); // Connect to the database
  await initializeDatabase(); // Initialize the database (sync models)
  app.listen(PORT, () => {
    // 使用我们的日志记录器替代 console.log
    logger.info(`服务器正在 ${process.env.NODE_ENV} 模式下运行于 ${PORT} 端口。`)
  })
}

startServer();
