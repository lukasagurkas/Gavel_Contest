const db = require('../models')

module.exports = {
    async getAll(req, res) {
        
        let data = await db.game.findAll({attributes: ['id', 'team1Name', 'team2Name', 'game']}).then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
            });
        });

        res.json(data)
    }
}
