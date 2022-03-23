const db = require('../models')

module.exports = {
    async getUser (req, res) {
        let data = db.user.findOne({where: {email:req.body.email}})
        
        res.json(data)
    },

    async getUserIsRegistered (req, res) {
        var bool = false;

        if (db.user.findOne({where: {email:req.body.email}}) == null) {
            bool = false;
        } else {
            bool = true;
        }

        res.json(bool)
    }
}