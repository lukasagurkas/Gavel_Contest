// // A BASIC Node server
// // Working with the HTTP Request Object

const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const util = require("util");
const formidable = require("formidable");
const fs = require("fs");
const lookup = require("mime-types").lookup

const server = http.createServer(function (req, res) {
    res.setHeader("Content-type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")

    const buffers = [];

    if (req.method.toLowerCase() == 'post') {
        var body = ""
        req.on("data", function(chunk) {
            body += chunk
        })
        req.on("end", function() {
            res.writeHead(200, {"Content-Type": "text/html"})
            console.log(body)
            res.end(body)
        })
    } else if (req.method.toLowerCase() == 'get') {
        let paths = ["test.html",
        "app.js",
        "test.css",
        "lib/cginput.js",
        "player.js",
        "player.html",
        "core/Drawer.js",
        "assets.js",
        "config.js",
        "core/utils.js",
        "core/constants.js",
        "core/ErrorLog.js",
        "core/rendering.js",
        "core/ModuleError.js",
        "entity-module/GraphicEntityModule.js",
        "entity-module/CommandParser.js",
        "entity-module/ContainerBasedEntity.js",
        "entity-module/Command.js",
        "entity-module/Entity.js",
        "entity-module/properties.js",
        "entity-module/EntityFactory.js",
        "core/transitions.js",
        "entity-module/errors/InvalidPlayerColorToken.js",
        "entity-module/Circle.js",
        "entity-module/Line.js",
        "entity-module/Rectangle.js",
        "entity-module/Sprite.js",
        "entity-module/Text.js",
        "entity-module/BitmapText.js",
        "entity-module/Group.js",
        "entity-module/BufferedGroup.js",
        "entity-module/SpriteAnimation.js",
        "entity-module/RoundedRectangle.js",
        "entity-module/Polygon.js",
        "entity-module/TilingSprite.js",
        "entity-module/Shape.js",
        "entity-module/SpriteBasedEntity.js",
        "entity-module/TextureBasedEntity.js",
        "entity-module/textUtils.js",
        "entity-module/errors/MissingBitmapFontError.js",
        "entity-module/errors/MissingImageError.js",
        "lib/pixi6.js",
        "assets/startingMarker.png",
        "assets/orange.png",
        "lib/pixi.min.js.map",
        "assets/red.png",
        "assets/blue.png",
        "favicon.ico",
        "assets/background.jpg",
        "assets/yellow.png",
        "assets/green.png"]

        const gamesRaw = fs.readdirSync(__dirname + "\\games")
        let games = []
        for (let i = 0; i < gamesRaw.length; i++) {
            games.push("games/" + gamesRaw[i])
        }
        paths = paths.concat(games)


        let parsedURL = url.parse(req.url, true)
        let path = parsedURL.path.replace(/^\/+|\/+$/g, "")
        if (!paths.includes(path) && !path.includes("?game=")) {
            console.log(path)
            return;
        } else if (path.includes("?game=")) {
            path = path.slice(0, path.lastIndexOf('?'))
        }

        if (path === "") {
            path = "test.html"
        }
        
        //path = path.replace(/\//g, "\\")
        let file = __dirname + "\\" + path

        fs.readFile(file, function (err, content) {
            if (err) {
                console.log(`File not found ${file}`)
                res.writeHead(404)
                res.end()
            } else if (path == "config.js") {
                res.setHeader("X-Content-Type-Options", "nosniff")
                res.writeHead(200, { "Content-type": "application/javascript" })
            }

            else {
                let mime = lookup(path)
                res.setHeader("X-Content-Type-Options", "nosniff")
                res.writeHead(200, { "Content-type": mime })
            }
            res.end(content)
        })
    }






});

server.listen(8000, function () {
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