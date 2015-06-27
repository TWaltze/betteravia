/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
// var util = require("util"),					// Utility resources (logging, object inspection, etc)
// 	io = require("socket.io"),				// Socket.IO
// 	Player = require("./Player").Player;	// Player class

var util = require("util")
var io = require('socket.io');
var express = require('express');
var http = require('http');
var Player = require("./Player").Player;

var app         = express();
var server      = http.createServer(app);

var verbose     = false;

// START THE SERVER
server.listen(4001);
console.log('Express server listening on port ' + 4001);

var socket = io.listen(server);

// By default, we forward the / path to index.html automatically.
app.get('/', function(req, res) {
    console.log('trying to load %s', __dirname + '/public/index.html');
    res.sendFile( '/public/index.html' , { root: __dirname });
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
    res.sendFile(__dirname + '/' + file);

});

/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players;	// Array of connected players


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: " + client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: " + this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: " + this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player(data.x, data.y, data.z);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {
        id: newPlayer.id,
        x: newPlayer.getX(),
        y: newPlayer.getY(),
        z: newPlayer.getZ()
    });

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];

		this.emit("new player", {
            id: existingPlayer.id,
            x: existingPlayer.getX(),
            y: existingPlayer.getY(),
            z: existingPlayer.getZ(),
        });
	};

	// Add new player to the players array
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: " + this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
    movePlayer.setY(data.y);
	movePlayer.setZ(data.z);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {
        id: movePlayer.id,
        x: movePlayer.getX(),
        y: movePlayer.getY(),
        z: movePlayer.getZ()
    });
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};

	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();
