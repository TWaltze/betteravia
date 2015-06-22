var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
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

function preload () {
    map = new Map(game);
    map.preload();

    player = new LocalPlayer(game, map);
    player.preload();
}

function create () {
    socket = io.connect(SERVER_URL);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    map.create();

    // The base of our player
    var x = Math.round(Math.random()*(1000)-500);
    var y = Math.round(Math.random()*(1000)-500);
    player.create("foobar", x, y);

    game.camera.follow(player.sprite);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    // Start listening for events
    setEventHandlers();
}

function update() {
    map.update();
    player.update();
}

function render() {

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
        x: player.sprite.x,
        y: player.sprite.y
    });
};

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
    console.log("New player connected: " + data.id);

    // Add new player to the remote players array
    var newPlayer = new Player(game, map);
    newPlayer.preload();
    newPlayer.create(data.id, data.x, data.y);

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

    // Update player position
    movePlayer.sprite.x = data.x;
    movePlayer.sprite.y = data.y;

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
