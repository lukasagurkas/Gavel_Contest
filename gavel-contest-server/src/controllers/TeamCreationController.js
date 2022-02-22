const db = require('../models')


module.exports = {
    async create (req, res) {
        const userId = await db.user.findOne({
            where: {email:req.body.email}})
            .then(function(user){
                return user.dataValues.id
        })

        if (await db.userteam.findOne({where: {userID:userId}}) != null) {
            res.status(400).send({
                error: "User already has team"
            })
        } else if (await db.team.findOne({where: {name:req.body.name}}) != null) {
            res.status(400).send({
                error: "Team name already exists"
            })
        } else {
            try {
                await db.team.create({name:req.body.name})
    
                const teamId = await db.team.findOne({
                    where: {name:req.body.name}})
                    .then(function(team){
                        return team.dataValues.id
                })
    
                await db.userteam.create({userID: userId, teamID: teamId})
                
            } catch (err) {
                res.status(400).send({
                    error: err
                })
                console.log("Error", err.message);
            }
        }
        
    }, 

    async join(req, res) {
        const userId = await db.user.findOne({
            where: {email:req.body.email}})
            .then(function(user){
                return user.dataValues.id
        })

        if (await db.userteam.findOne({where: {userID:userId}}) != null) {
            res.status(400).send({
                error: "User already has team"
            })
        } else {
            try {
                const teamId = await db.team.findOne({
                    where: {name:req.body.name}})
                    .then(function(team){
                        return team.dataValues.id
                })

                await db.userteam.create({userID: userId, teamID: teamId})
            } catch (error) {
                res.status(400).send({
                    error: err
                })
                console.log("Error", err.message);
            }
        }
    }
}