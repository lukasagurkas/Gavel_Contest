const db = require('../models')

const fs = require('fs')

const path = require('path');


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
        tempFile = req.files.file;

        if (path.extname(tempFile.name) == '.java' || path.extname(tempFile.name) == '.py' || path.extname(tempFile.name) == '.cs') {
            let temp = req.body.teamName
            temp = temp.replace(/ /g,"_");
            if (path.parse(path.basename(tempFile.name)).name == temp) {
                uploadPath = dirpath + tempFile.name;

                // Use the mv() method to place the file somewhere on your server
                tempFile.mv(uploadPath, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        res.send('File uploaded!');
                    }
                });
            } else {
                res.status(400).send({
                    error: "File name has to be the same as the team name (except that spaces are turned into underscores), which is " + temp
                })
            }
        } else {
            res.status(400).send({
                error: "Only .java or .py or .cs file extensions are accepted"
            })
        }
    }
}