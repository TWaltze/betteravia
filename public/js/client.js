var width = window.innerWidth;
var height = window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var socket;
var map;
var player;
var remotePlayers = [];
var currentSpeed = 0;
var cursors;
var space;

function preload () {
    game.time.advancedTiming = true;

    // Add the Isometric plug-in to Phaser
    game.plugins.add(new Phaser.Plugin.Isometric(game));

    map = new Map(game);
    map.preload();

    // Start the physical system
	game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

    // set the middle of the world in the middle of the screen
	game.iso.anchor.setTo(0.5, 0);

    player = new LocalPlayer(game, map);
    player.preload();
}

function create () {
    socket = io.connect(SERVER_URL);

    //  We're going to be using physics, so enable the Arcade Physics system
    // game.physics.startSystem(Phaser.Physics.ARCADE);

    map.create();

    // The base of our player
    var x = Math.round(Math.random()*(200));
    var y = Math.round(Math.random()*(200));
    player.create("foobar", x, y, 0);

    // game.camera.follow(player.sprite);
    // game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    // game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Start listening for events
    setEventHandlers();
}

function update() {
    player.update();
    map.update();

    if(space.isDown) {
        // var x = Math.round(Math.random()*(200));
        // var y = Math.round(Math.random()*(200));
        // console.log("after update", map.thing.isoPosition.set(map.thing.isoPosition.x + 1, map.thing.isoPosition.y + 1, 2));
    }
}

function render() {
    player.render();
}

// Find player by ID
function findPlayer(id) {
    for (var i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].sprite.name == id) {
            return remotePlayers[i];
        }
    };

    return false;
};

var setEventHandlers = function() {
    // Socket connection successful
    socket.on("connect", onSocketConnected);

    // Socket disconnection
    socket.on("disconnect", onSocketDisconnect);

    // New player message received
    socket.on("new player", onNewPlayer);

    // Player move message received
    socket.on("move player", onMovePlayer);

    // Player removed message received
    socket.on("remove player", onRemovePlayer);
};

// Socket connected
function onSocketConnected() {
    console.log("Connected to socket server");

    // Send local player data to the game server
    socket.emit("new player", {
        x: player.sprite.isoX,
        y: player.sprite.isoY,
        z: player.sprite.isoZ
    });
};

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    console.log("player", data);
    // Add new player to the remote players array
    var newPlayer = new Player(game, map);
    newPlayer.preload();
    newPlayer.create(data.id, data.x, data.y, data.z);

    remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
    var movePlayer = findPlayer(data.id);

    // Player not found
    if (!movePlayer) {
        console.log("Player not found: " + data.id);
        return;
    };

    // Update player position during next update loop
    movePlayer.nextPosition = data;

    // Update player position
    // movePlayer.sprite.isoPosition.setTo(data.x, data.y, data.z);
    // console.log("data", data);
    // console.log("pos", movePlayer.sprite.isoPosition);

};

// Remove player
function onRemovePlayer(data) {
    var removePlayer = findPlayer(data.id);

    // Player not found
    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    };

    removePlayer.sprite.kill();

    // Remove player from array
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);

};
