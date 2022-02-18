const AuthenticationController = require('./controllers/AuthenticationController')
const TeamCreationController = require('./controllers/TeamCreationController.js')
const TeamCreationControllerPolicy = require('./policies/TeamCreationControllerPolicy.js')

module.exports = (app) => {
    app.post('/register', 
        AuthenticationController.register)

    app.post('/createTeam',
        TeamCreationControllerPolicy.create,
        TeamCreationController.create)
}
