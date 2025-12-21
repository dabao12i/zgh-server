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
const swaggerUi = require('swagger-ui-express') // 导入 swagger-ui-express
const swaggerSpec = require('./config/swagger') // 导入 Swagger 配置

// 创建一个 Express 应用
const app = express()
// 跨域处理
app.use(cors())
// ================== API 文档路由 ==================
// 将 Swagger UI 放在自定义响应处理之前，避免冲突
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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

// 导入并注册 API 路由模块
const apiRouter = require('./routers/index')
app.use('/api', apiRouter)

// 一个用于测试我们的异步错误处理器的路由
// 使用 asyncHandler 包装后，可以直接 throw 错误
app.get(
  '/error',
  asyncHandler(async (req, res, next) => {
    // 模拟一个异步操作
    await new Promise((resolve) => setTimeout(resolve, 100))
    // 在异步函数中直接抛出错误
    throw new Error('这是一个在异步路由中被捕获的测试错误!')
  })
)

// 全局错误处理器 - 必须是最后一个中间件
app.use(errorHandler)

// 从环境变量获取端口，并提供一个默认值
const PORT = process.env.PORT || 3000

// 启动服务器
app.listen(PORT, () => {
  // 使用我们的日志记录器替代 console.log
  logger.info(`服务器正在 ${process.env.NODE_ENV} 模式下运行于 ${PORT} 端口。`)
})
