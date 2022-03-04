const db = require('../models')

module.exports = {
    async getAll(req, res) {
        
        let data = await db.games.findAll({attributes: ['team1Name', 'team2Name']}).then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
            });
        });

        res.json(data)
    }
}
