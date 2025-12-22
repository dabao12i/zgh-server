const { DataTypes } = require('sequelize')
const { level } = require('winston')

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.NUMBER,
        default: 0,
      },
      level: {
        type: DataTypes.NUMBER,
        default: 0,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt timestamps
    }
  )
  return User
}
