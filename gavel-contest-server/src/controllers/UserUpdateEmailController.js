const db = require('../models')

module.exports = {
    async updateUserEmail(req, res) {
        try {
            const result = await db.user.update(
                { email: req.body.email },
                { where: { id: req.body.id } }
            )
        } catch (err) {
            console.log(err)
        }

        res.json(data)
    }
}