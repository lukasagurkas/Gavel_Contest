const AuthenticationController = require('./controllers/AuthenticationController')
const TeamCreationController = require('./controllers/TeamCreationController.js')

module.exports = (app) => {
    app.post('/register', 
        AuthenticationController.register)

    app.post('/createTeam',
        TeamCreationController.create)
}
