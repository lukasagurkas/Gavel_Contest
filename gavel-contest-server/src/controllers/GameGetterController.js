const db = require('../models')

module.exports = {
    async getAll(req, res) {
        
        let data = await db.game.findAll({attributes: ['id', 'team1Name', 'team2Name', 'game']}).then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
            });
        });

        res.json(data)
    },

    getCipher(req, res) {
        const cipher = salt => {
            const textToChars = text => text.split('').map(c => c.charCodeAt(0));
            const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
            const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
      
            return text => text.split('')
              .map(textToChars)
              .map(applySaltToChar)
              .map(byteHex)
              .join('');
            }
        const myCipher = cipher("test")
        res.send(myCipher(req.body.name))
    }
}
