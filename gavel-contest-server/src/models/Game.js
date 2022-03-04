const Sequelize = require('sequelize')
const config = require('../config/config')
const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

module.exports = (sequelize, DataTypes) => {
    sequelize.define('game', {
        game: {
            type: Sequelize.DataTypes.JSON
        },
        team1Name: {
            type: Sequelize.DataTypes.STRING
        },
        team2Name: {
            type: Sequelize.DataTypes.STRING
        }
    })
}