var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload () {
    game.load.image('earth', 'public/assets/light_sand.png');
    game.load.spritesheet('dude', 'public/assets/dude.png', 64, 64);
    game.load.spritesheet('enemy', 'public/assets/dude.png', 64, 64);
}

var socket;
var land;
var player;
var remotePlayers;
var currentSpeed = 0;
var cursors;


function create () {
    socket = io.connect(SERVER_URL);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-500, -500, 1000, 1000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our player
    var startX = Math.round(Math.random()*(1000)-500),
        startY = Math.round(Math.random()*(1000)-500);

    player = game.add.sprite(startX, startY, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
    player.animations.add('stop', [3], 20, true);

    player.anchor.setTo(0.5, 0.5);

    player.name = "foobar";
    // player.body.immovable = true;
    player.body.collideWorldBounds = true;

    //  This will force it to decelerate and limit its speed
    // player.body.maxVelocity.setTo(400, 400);
    // player.angle = game.rnd.angle();

    //  Create some baddies to waste :)
    enemies = [];

    // player.bringToTop();

    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    // Start listening for events
    setEventHandlers();
}

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
    socket.emit("new player", {x: player.x, y:player.y});
};

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
    console.log("New player connected: "+data.id);

    // Add new player to the remote players array
    enemies.push(new Player(data.id, game, data.x, data.y));
	console.log(enemies);
};

// Move player
function onMovePlayer(data) {

    var movePlayer = playerById(data.id);

    // Player not found
    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    // Update player position
    movePlayer.sprite.x = data.x;
    movePlayer.sprite.y = data.y;

};

// Remove player
function onRemovePlayer(data) {

    var removePlayer = playerById(data.id);

    // Player not found
    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    removePlayer.sprite.kill();

    // Remove player from array
    enemies.splice(enemies.indexOf(removePlayer), 1);

};

function update () {

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            game.physics.arcade.collide(player, enemies[i].sprite);
        }
    }

    if (cursors.left.isDown)
    {
        player.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        player.angle += 4;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 300;
    }
    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);

        player.animations.play('move');
    }
    else
    {
        player.animations.play('stop');
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown)
    {
        if (game.physics.arcade.distanceToPointer(player) >= 10) {
            currentSpeed = 300;

            player.rotation = game.physics.arcade.angleToPointer(player);
        }
    }

    socket.emit("move player", {x: player.x, y:player.y});
}

function render () {

}
