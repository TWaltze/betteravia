var io          = require('socket.io');
var express     = require('express');
var UUID        = require('node-uuid');
var http        = require('http');

var app         = express();
var server      = http.createServer(app);

var verbose     = false;
var port        = process.env.PORT || 4004;


/* Express server set up. */

// The express server handles passing our content to the browser,
// As well as routing users where they need to go. This example is bare bones
// and will serve any file the user requests from the root of your web server (where you launch the script from)
// so keep this in mind - this is not a production script but a development teaching tool.

// Tell the server to listen for incoming connections
server.listen(port)

// Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + port);

// By default, we forward the / path to index.html automatically.
app.get('/', function(req, res) {
    console.log('trying to load %s', __dirname + '/public/index.html');
    res.sendfile( '/public/index.html' , { root: __dirname });
});


// This handler will listen for requests on /*, any file from the root of our server.
// See expressjs documentation for more info on routing.

app.get('/*', function(req, res, next) {

    // This is the current file they have requested
    var file = req.params[0];

    // For debugging, we can track what files are requested.
    if(verbose) {
        console.log('\t :: Express :: file requested : ' + file);
    }

    // Send the requesting client the file.
    res.sendfile(__dirname + '/' + file);

}); // app.get *


/* Socket.IO server set up. */

// Express and socket.io can work together to serve the socket.io client files for you.
// This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.

// Create a socket.io instance using our express server
var socket = io.listen(server);

// Enter the game server code. The game server handles
// client connections looking for a game, creating games,
// leaving games, joining games and ending games when they leave.
game_server = require('./server/GameServer.js');
game_server.init();

// Socket.io will call this function when a client connects,
// So we can send that client looking for a game to play,
// as well as give that client a unique ID to use so we can
// maintain the list if players.
socket.sockets.on('connection', function(client) {
    // Generate a new UUID, looks something like
    // 5b2ca132-64bd-4513-99da-90e838ca47d1
    // and store this on their socket/connection
    client.uid = '1'; //UUID();

    // tell the player they connected, giving them their id
    client.emit('onconnected', { id: client.userid } );

    // now we can find them a game to play with someone.
    // if no game exists with someone waiting, they create one and wait.
    game_server.joinGame('1', client);

    // Useful to know when someone connects
    console.log('\t socket.io:: player ' + client.uid + ' connected');

    // Now we want to handle some of the messages that clients will send.
    // They send messages here, and we send them to the game_server to handle.
    client.on('message', function(m) {
        game_server.onMessage(client, m);

    }); // client.on message

    // When this client disconnects, we want to tell the game server
    // about that as well, so it can remove them from the game they are
    // in, and make sure the other player knows that they left and so on.
    client.on('disconnect', function () {
        // Useful to know when soomeone disconnects
        console.log('\t socket.io:: client disconnected ' + client.userid + ' ' + client.game_id);

        // If the client was in a game, set by game_server.findGame,
        // we can tell the game server to update that game state.
        if(client.game && client.game.id) {
            // player leaving a game should destroy that game
            game_server.endGame(client.game.id, client.userid);

        } // client.game_id

    }); // client.on disconnect

}); // socket.sockets.on connection
