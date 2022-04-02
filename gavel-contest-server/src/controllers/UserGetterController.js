const db = require('../models')

module.exports = {
    async getUser (req, res) {
        let data = db.user.findOne({where: {email:req.body.email}})
        
        res.json(data)
    },
    async getUserIsRegistered (req, res) {
        let registered;

        if (db.user.findOne({where: {email:req.body.email}}) == null) {
            registered = false;
        } else {
            registered = true;
        }

        res.json(registered)
    }
}