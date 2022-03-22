const fs = require('fs')

module.exports = {
    async getGamesList(req, res) {
        var files = fs.readdirSync('./games');
        //console.log(files)
        res.json(files)
    }
}
