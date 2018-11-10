let express = require('express');
let app = express()
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let port = 3000
let sockets = [];

/** Server */

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.sendFile(__dirname+ '/index.html');
});

app.get('/coffeeMaker', function(request, response) {
    response.sendFile(__dirname+ '/coffeeMaker.html');
});

server.listen(port, function() {
    console.info('Sorting Server is Ready!');
});

/** Sockets */

io.on('connection', function(socket) {
    console.log('we have a connection in ' + socket.id);
    socket.on('disconnect', function() {
        console.log('oh no! '+ socket.id + 'left us!');
    });

    socket.on('sendCoffeMakerName', function(data) {
        sockets.push({
            "id": socket.id,
            "name": data
        });
        io.emit('updateParticipants', data);
    });

    socket.on('winParticipant', function() {
        console.log(sockets.length);
        let winnerIndex = Math.floor(Math.random() * sockets.length);
        console.log(winnerIndex);
        console.log("The winner is "+ sockets[winnerIndex].id);
        console.log("The winner is "+ sockets[winnerIndex].name);
        io.emit('updateWinParticipant', sockets[winnerIndex].name);
    });
});


