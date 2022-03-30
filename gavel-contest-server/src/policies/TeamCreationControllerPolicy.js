const Joi = require('joi')

module.exports = {
    create(req, res, next) {
        const schema = Joi.string().min(3).max(30).required().pattern(new RegExp('^[a-zA-Z][a-zA-Z0-9 ]+[a-zA-Z0-9]$'))

        const {error, value} = schema.validate(req.body.name)

        if (error) {
            res.status(400).send({
                error: "Please provide a team name between 3 and 30 characters using only alphanumerical characters starting with an alphabetical character"
            })
        } else {
            next()
        }

        
    }
}