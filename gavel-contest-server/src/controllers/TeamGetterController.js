const db = require('../models')

module.exports = {
    async getAll(req, res) {
        
        let data = await db.team.findAll({attributes: ['name']}).then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
            });
        });

        res.json(data)
    },

    async getUserTeam(req, res) {
        const userId = await db.user.findOne({
            where: {email:req.body.email}})
            .then(function(user){
                return user.dataValues.id
        })
        
        const teamId = await db.userteam.findOne({
            where: {userId: userId}})
            .then(function(userteam) {
                return userteam.dataValues.teamID
            })

        let teamName = await db.team.findOne({
            where: {id: teamId}})
            .then(function(team) {
                return team.dataValues.name
            })

        if(!teamName) {
            teamName = '-'
        }

        res.json(teamName)
    }
}
