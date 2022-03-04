const AuthenticationController = require('./controllers/AuthenticationController')
const TeamCreationController = require('./controllers/TeamCreationController.js')
const TeamCreationControllerPolicy = require('./policies/TeamCreationControllerPolicy.js')
const TeamGetterController = require('./controllers/TeamGetterController')
const GameUploadController = require('./controllers/GameUploadController.js')
const GameGetterController = require('./controllers/GameGetterController.js')

module.exports = (app) => {
    app.post('/register',
        AuthenticationController.register)

    app.post('/createTeam',
        TeamCreationControllerPolicy.create,
        TeamCreationController.create)

    app.post('/joinTeam',
        TeamCreationController.join)

    app.get('/getAllTeams',
        TeamGetterController.getAll)

    app.post('/uploadGame',
        GameUploadController.uploadGame)

    app.get('/getAllGames',
        GameGetterController.getAll)
}
