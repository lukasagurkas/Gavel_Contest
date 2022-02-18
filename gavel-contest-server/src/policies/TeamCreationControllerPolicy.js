const Joi = require('joi')

module.exports = {
    create(req, res, next) {
        const schema = Joi.string().min(3).max(30).required()

        const {error, value} = schema.validate(req.body.name)

        if (error) {
            console.log("Please provide a team name between 3 and 30 characters")
        } else {
            next()
        }

        
    }
}