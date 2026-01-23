#!/usr/bin/env node

/**
 * 诊断脚本 - 检查应用启动前的环境和依赖
 * 运行: node diagnose.js
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

console.log('\n🔍 开始诊断...\n');

// 1. 检查环境变量
console.log('1️⃣  检查环境变量...');
const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`);
console.log(`   加载文件: ${envPath}`);

if (!fs.existsSync(envPath)) {
  console.log(`   ❌ 文件不存在!`);
  process.exit(1);
}

const envConfig = dotenv.config({ path: envPath });
if (envConfig.error) {
  console.log(`   ❌ 加载失败: ${envConfig.error.message}`);
  process.exit(1);
}
console.log(`   ✅ 环境变量加载成功`);
console.log(`   - PORT: ${process.env.PORT}`);
console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   - DB_HOST: ${process.env.DB_HOST}`);
console.log(`   - DB_USER: ${process.env.DB_USER}`);
console.log(`   - DB_NAME: ${process.env.DB_NAME}`);
console.log(`   - DB_PORT: ${process.env.DB_PORT}`);

// 2. 检查关键模块
console.log('\n2️⃣  检查关键模块...');
const modules = [
  'express',
  'dotenv',
  'cors',
  'sequelize',
  'mysql2',
  'bcryptjs',
  'jsonwebtoken',
  'winston',
  'multer',
  'sharp'
];

for (const mod of modules) {
  try {
    require.resolve(mod);
    console.log(`   ✅ ${mod}`);
  } catch (e) {
    console.log(`   ❌ ${mod} - 未安装`);
  }
}

// 3. 检查数据库连接
console.log('\n3️⃣  检查数据库连接...');
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    });
    
    console.log(`   ✅ MySQL 连接成功`);
    
    // 检查数据库是否存在
    const [databases] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [process.env.DB_NAME]
    );
    
    if (databases.length > 0) {
      console.log(`   ✅ 数据库 '${process.env.DB_NAME}' 存在`);
    } else {
      console.log(`   ⚠️  数据库 '${process.env.DB_NAME}' 不存在，应用会尝试创建它`);
    }
    
    await connection.end();
  } catch (err) {
    console.log(`   ❌ MySQL 连接失败:`);
    console.log(`      ${err.message}`);
    console.log(`\n      可能的原因:`);
    console.log(`      1. MySQL 服务未启动`);
    console.log(`      2. 用户名/密码错误`);
    console.log(`      3. 主机地址错误`);
    console.log(`      4. 端口错误`);
    process.exit(1);
  }
})();
