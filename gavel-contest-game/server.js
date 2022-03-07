// // A BASIC Node server
// // Working with the HTTP Request Object

const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const util = require("util");
const formidable = require("formidable");
const fs = require("fs");
const lookup = require("mime-types").lookup

const server = http.createServer(function(req, res) {

    //res.setHeader("Content-type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")

    let parsedURL = url.parse(req.url, true)
    let path = parsedURL.path.replace(/^\/+|\/+$/g, "")
    if (path == "") {
        path = "test.html"
    }
    path = path.replace(/\//g, "\\")
    let file = __dirname + "\\"+ path
    fs.readFile(file, function(err, content) {
        if (err) {
            console.log(`File not found ${file}`)
            res.writeHead(404)
            res.end()
        } else if (path == "config.js") {
            res.setHeader("X-Content-Type-Options", "nosniff")
            res.writeHead(200, {"Content-type": "application/javascript"})
        } 
        
        else {
            console.log(path)
            let mime = lookup(path)
            res.setHeader("X-Content-Type-Options", "nosniff")
            res.writeHead(200, {"Content-type": mime})
        }
        res.end(content)
    })

    

    // if (req.method.toLowerCase() == 'post') {
    //     let form = new formidable.IncomingForm()
    //     form.parse(req, function(err, fields, files) {
    //         if(err) {
    //             console.log(err.message)
    //         }
    //         console.log(fields.game)
    //         res.end(fields.game)
    //     })
    // } else if (req.method.toLowerCase() == "get") {
    //     res.writeHead(200, "OK", {"Content-Type": "text/plain"})
    //     res.end(req.url)
    // }
});

server.listen(8000, function() {
  console.log("Listening on port 8000");
});

// var http = require('http');
// var fs = require('fs');

// const PORT=8000; 

// fs.readFile('./test.html', function (err, html) {

//     if (err) throw err;

//     http.createServer(function(request, response) {
//         response.setHeader("Access-Control-Allow-Origin", "*")
//         response.writeHeader(200, {"Content-Type": "text/html"});
//         response.write(html);
//         response.end();
//     }).listen(PORT);
// });