const db = require('../models')

module.exports = {
    async getAll(req, res) {
        
        let data = await db.team.findAll({attributes: ['name']}).then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
            });
        });

        res.json(data)
    }
}
