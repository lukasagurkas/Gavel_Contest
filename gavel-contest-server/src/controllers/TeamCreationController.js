const db = require('../models')


module.exports = {
    async create (req, res) {
        //TODO check if user already part of a team
        try {
            const team = await db.team.create({name:req.body.name})
            res.send(team.toJSON())
            const userId = await db.user.findOne({
                where: {email:req.body.email}})
                .then(function(user){
                    return user.dataValues.id
            })

            const teamId = await db.team.findOne({
                where: {name:req.body.name}})
                .then(function(team){
                    return team.dataValues.id
            })

            console.log("User ID:", userId, "Team ID:",teamId)
        } catch (err) {
            res.status(400).send({
                error: err
            })
            console.log("Error", err.message);
        }
    }
}