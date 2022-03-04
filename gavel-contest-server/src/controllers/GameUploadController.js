const db = require('../models')


module.exports = {
    async uploadGame(req, res) {
        if (req.body.team1Name == req.body.team2Name) {
            res.status(400).send({
                error: "Team names are the same. Select different team names"
            })
            console.log("Team names are the same. Select different team names");
        } else {
            try {
                await db.game.create({ game: req.body.gameJSON, team1Name: req.body.team1Name, team2Name: req.body.team2Name })
            } catch (err) {
                res.status(400).send({
                    error: err
                })
                console.log("Error", err.message);
            }
        }
    }
}