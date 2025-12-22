const { DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // 'Users' is the table name for the User model
          key: 'id',
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  )

  RefreshToken.createToken = async function (user) {
    const expiredAt = new Date()
    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SEC))

    const _token = uuidv4()

    const refreshToken = await this.create({
      token: _token,
      userId: user.id,
      expiresAt: expiredAt.toISOString(),
    })

    return refreshToken.token
  }

  RefreshToken.verifyExpiration = (token) => {
    return token.expiresAt.getTime() < new Date().getTime()
  }

  return RefreshToken
}
