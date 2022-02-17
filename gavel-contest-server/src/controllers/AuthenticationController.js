const Sequelize = require('sequelize')
const config = require('../config/config')
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
module.exports = {
    async register (req, res) {
        await User.findOne({where: {email:req.body.email}}).then(async function(user){
            if (user == null) {
                try {
                    const user = await User.create(req.body)
                    res.send(user.toJSON())
                } catch (err) {
                    res.status(400).send({
                        error: err
                    })
                    console.log("Error", err.message);
                }
            }
            
        }).catch(function(error){
            console.log(error)
        });
        
        
    }
}