const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

const User = sequelize.define('user', {
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true
    },
    name: {
        type: Sequelize.DataTypes.STRING
    }
})

db['user'] = User

const Team = sequelize.define('team', {
    name: {
        type: Sequelize.DataTypes.STRING
    }
})

db['team'] = Team

// fs
//     .readdirSync(__dirname)
//     .filter((file) =>
//         file !== 'index.js'
//     )
//     .forEach((file) => {
//         const model = sequelize.define(path.join(__dirname, file))
//         db[model.name] = model
//     })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
