const db = require('../models')

const fs = require('fs')


module.exports = {
    async uploadFile(req, res) {
        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let dirpath = __dirname + '../../../source_code/' + req.body.teamName + "/"

        fs.mkdirSync(dirpath, { recursive: true })

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.file;
        uploadPath = dirpath  + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);

            res.send('File uploaded!');
        });
    }
}