const AuthenticationController = require('./controllers/AuthenticationController')
const TeamCreationController = require('./controllers/TeamCreationController.js')
const TeamCreationControllerPolicy = require('./policies/TeamCreationControllerPolicy.js')
const TeamGetterController = require('./controllers/TeamGetterController')
const GameUploadController = require('./controllers/GameUploadController.js')
const GameGetterController = require('./controllers/GameGetterController.js')
const UserGetterController = require('./controllers/UserGetterController.js')
const UserUpdateEmailController = require('./controllers/UserUpdateEmailController.js')
const GameListGetterController = require('./controllers/GameListGetterController.js')
const SourceCodeUploadController = require('./controllers/SourceCodeUploadController.js')

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

    app.get('/getUser',
        UserGetterController.getUser)

    app.post('/updateUserEmail',
        UserUpdateEmailController.updateUserEmail)

    app.get('/getGamesList',
        GameListGetterController.getGamesList)

    app.post('/uploadFile',
        SourceCodeUploadController.uploadFile)

    app.post('/getUserTeam',
        TeamGetterController.getUserTeam)

    app.post('/getPassword',
        TeamGetterController.getPassword)
        
    app.post('/getUserInTeam',
        TeamGetterController.getUserInTeam)

    app.delete('/deleteUserTeams',
        TeamCreationController.deleteUserTeams)

    app.post('/getCipher',
        GameGetterController.getCipher)

    app.post('/getUserIsRegistered',
        UserGetterController.getUserIsRegistered)
}
