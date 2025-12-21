const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')

// Swagger 定义
const swaggerDefinition = {
  openapi: '3.0.0', // 指定 OpenAPI 版本
  info: {
    title: 'GZH-TEM API 文档', // 文档标题
    version: '1.0.0', // 版本号
    description: '这是一个使用 Express 构建的模块化项目的 API 文档。', // 描述
  },
}

// 选项配置
const options = {
  swaggerDefinition,
  // 指定 swagger-jsdoc 去哪里查找包含 API 定义注释的文件
  apis: [path.resolve(__dirname, '../routers/*.js')],
}

// 初始化 swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
