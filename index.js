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

    var userIncrement = 0;
    socket.username = 'Anon-' + userIncrement;
    userIncrement++;

    console.log('connected')
    socket.emit('client_connect', { hello: 'FROM THE SERVER' });

    //When player is writting
    socket.on('message', function(data){
        socket.emit('message', {username: socket.username, message: data.message});
    });

});
//WHen player disconnect from channel
io.on('disconnect', function(socket){

});



// When an user is playing
io.on('playing', function(data){
    socket.broadcast.emit('playing', {socket: socket.username});
});