const Sequelize = require('sequelize')
const config = require('../config/config')
const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

module.exports = (sequelize, DataTypes) => {
    sequelize.define('user', {
        email: {
            type: Sequelize.DataTypes.STRING,
            unique: true
        },
        name: {
            type: Sequelize.DataTypes.STRING
        }
    })
}