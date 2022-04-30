const db = require('../models')

module.exports = {
    async delete(req, res) {
        try {
            const userId = await db.user.findOne({
                where: { email: req.body.email }
            })
                .then(function (user) {
                    return user.dataValues.id
                })
            await db.userteam.destroy({
                where: {userId: userId}
            }).then(() => {res.status(200).send("Successfully deleted user-team")})
        } catch (e) {
            res.status(400).send(
                {error: e}
            )
        }
    }
}