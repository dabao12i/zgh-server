const mysql = require('mysql2/promise');
require('dotenv').config();

const initDb = async () => {
    let connection;
    let dbConnection;
    try {
        // Connect to MySQL server without specifying a database to create it if it doesn't exist
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });

        console.log('Connected to MySQL server to check/create database.');

        // Create the database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database '${process.env.DB_NAME}' checked/created successfully.`);

        await connection.end(); // Close the initial connection

        // Now connect to the specific database to potentially create tables
        dbConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        console.log(`Connected to database '${process.env.DB_NAME}' for table initialization.`);

        // For now, we won't add specific CREATE TABLE statements here for Sequelize-managed models
        // as Sequelize's `sync()` will handle that.
        // This utility primarily ensures the database exists.
        // If you had non-Sequelize managed tables, their CREATE TABLE statements would go here.

        console.log('Manual database table initialization complete (if any).');

    } catch (error) {
        console.error('Error during database initialization (init_db.js):', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
        if (dbConnection) {
            await dbConnection.end();
        }
    }
};

module.exports = initDb;