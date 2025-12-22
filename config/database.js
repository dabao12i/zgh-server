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
    logging: false, // Set to true to see SQL queries in the console
  }
);

// Dynamically import and initialize all models
const modelsDir = path.join(__dirname, '../models');
fs.readdirSync(modelsDir)
  .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
  .forEach(file => {
    const modelDefiner = require(path.join(modelsDir, file));
    modelDefiner(sequelize); // Pass the sequelize instance to the model definition function
  });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` will try to change existing tables to match models
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB, initializeDatabase };
