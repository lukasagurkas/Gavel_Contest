const db = require('../models')

module.exports = {
    async getAll(req, res) {

        let data = await db.team.findAll({ attributes: ['name'] }).then((rows) => {
            return rows.map((r) => {
                return r.dataValues;
            });
        });

        res.json(data)
    },

    async getUserTeam(req, res) {
        if (await db.user.findOne({
            where: { email: req.body.email }
        }) != null) {
            const userId = await db.user.findOne({
                where: { email: req.body.email }
            })
                .then(function (user) {
                    return user.dataValues.id
                })

            if (await db.userteam.findOne({
                where: { userId: userId }
            }) != null) {

            const teamId = await db.userteam.findOne({
                where: { userId: userId }
            })
                .then(function (userteam) {
                    return userteam.dataValues.teamID
                })

            let teamName = await db.team.findOne({
                where: { id: teamId }
            })
                .then(function (team) {
                    return team.dataValues.name
                })

            if (!teamName) {
                teamName = '-'
            }

            res.json(teamName)
        } else {
            res.json("")
        }
        }
    },


    async getUserInTeam(req, res) {
        var bool = false

        const userId = await db.user.findOne({
            where: { email: req.body.email }
        })
            .then(function (user) {
                return user.dataValues.id
            })

        if (await db.userteam.findOne({ where: { userId: userId } }) == null) {
            bool = false;
        } else {
            bool = true;
        }

        res.json(bool)
    },
    async getPassword(req, res) {
        const userId = await db.user.findOne({
            where: { email: req.body.email }
        })
            .then(function (user) {
                return user.dataValues.id
            })

        const teamId = await db.userteam.findOne({
            where: { userId: userId }
        })
            .then(function (userteam) {
                return userteam.dataValues.teamID
            })

        let password = await db.team.findOne({
            where: { id: teamId }
        })
            .then(function (team) {
                return team.dataValues.password
            })

        res.json(password)

    }
}
