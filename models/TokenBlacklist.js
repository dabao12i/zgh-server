const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const TokenBlacklist = sequelize.define(
    'TokenBlacklist',
    {
      jti: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  )
  return TokenBlacklist
}
