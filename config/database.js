const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // 设置为 true 可在控制台查看 SQL 查询
  }
);

// 动态导入并初始化所有模型
const models = {}; // 创建一个对象来存放所有模型
const modelsDir = path.join(__dirname, '../models');
fs.readdirSync(modelsDir)
  .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
  .forEach(file => {
    const modelDefiner = require(path.join(modelsDir, file));
    const model = modelDefiner(sequelize); // 获取模型实例
    models[model.name] = model; // 按名称存储
  });

// 为方便起见，将模型附加到 sequelize 实例上
sequelize.models = models;

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接已成功建立。');
  } catch (error) {
    console.error('无法连接到数据库：', error);
    process.exit(1); // 失败后退出进程
  }
};

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // `force: true` 会删除现有表
    console.log('数据库已同步。');
  } catch (error) {
    console.error('同步数据库时出错：', error);
    process.exit(1);
  }
};

module.exports = { sequelize, models, connectDB, initializeDatabase };
