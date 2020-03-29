const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const args = process.argv.slice(2);
var height, width, imgUrl = 'https://www.challenges.fr/assets/img/2008/08/12/cover-r4x3w1000-58352afa3b690-bugs-bunny-3-g.jpg';

var getRandomColor = function () {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

//GET ARGS FROM SERVER: npm start -- <height> <width> <imgUrl>
if (args.length >= 3) {

    height = args[0];
    width = args[1];
    imgUrl = args[2];
    pixels = [];
    pixelsHidden = [];

    const widthMap = 550;
    const heightMap = 550;

    var squareW = (widthMap / width);
    var squareY = (heightMap / height);

    for (var x = 0; x < widthMap; x += squareW) {
        for (var y = 0; y < heightMap; y += squareY) {
            pixels.push({
                x,
                y,
                width: squareW,
                height: squareY,
                color: getRandomColor()
            });
        }
    }

    app.use(express.static(__dirname + '/public'));
    server.listen(8080);

    //render index.html

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    io.on('connection', function (socket) {

        var randUser = Math.floor(Math.random() * 1000);
        socket.username = 'Anon-' + randUser;

        socket.emit('init', { imgUrl, pixels, pixelsHidden });

        //When player is writting
        socket.on('message', function (data) {
            io.sockets.emit('message', { username: socket.username, message: data.message });
        });

        /**
         * 
         */
        socket.on('hidden', function (data) {
            pixelsHidden.push(pixels.filter((elem) =>
                elem.x <= data.x
                && data.x <= elem.x + elem.width
                && elem.y <= data.y
                && data.y <= elem.y + elem.height
            ));

            io.emit('init', {
                imgUrl,
                pixels,
                pixelsHidden
            });
        });

    });
    //WHen player disconnect from channel
    io.on('disconnect', function (socket) {

    });

} else {
    console.error("Missing parementers: npm start -- <height> <width> <imgUrl>");
    process.exit(1);
}