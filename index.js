const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const args = process.argv.slice(2);
    app.use(express.static(__dirname + '/public'));
    server.listen(8080);

var height, width, imgUrl;

console.log(args);
//GET ARGS FROM SERVER: npm start -- <height> <width> <imgUrl>
if(args.length >= 3){
    height = args[0];
    width = args[1];
    imgUrl = args[2];
}else{
    console.error("Missing parementers: npm start -- <height> <width> <imgUrl>");
}
//render index.html

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
    socket.emit('client_connect', { hello: 'FROM THE SERVER' });
    socket.on('my other event', function (data) {
    console.log(data);
  });
});
//WHen player disconnect from channel
io.on('disconnect', function(socket){

});

//When playing is writting
io.on('message', function(from, msg){

});

// When an user is playing
io.on('playing', function(data){
    socket.broadcast.emit('playing', {socket: socket.username});
});