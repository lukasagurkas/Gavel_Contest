const db = require('../models')

module.exports = {
    async getUser (req, res) {
        let data = db.user.findOne({where: {email:req.body.email}})
        
        res.json(data)
    }
}