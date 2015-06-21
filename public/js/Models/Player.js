Player = function (index, game, player, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.alive = true;

    this.player = game.add.sprite(x, y, 'enemy');

    this.player.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
    this.player.animations.add('stop', [3], 20, true);

    this.player.anchor.setTo(0.5, 0.5);
	game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.name = index.toString();
    this.player.body.immovable = true;
    this.player.body.collideWorldBounds = true;

    this.player.angle = game.rnd.angle();

    this.lastPosition = { x: x, y: y }
};

Player.prototype.update = function() {
    if(this.player.x != this.lastPosition.x || this.player.y != this.lastPosition.y) {
        this.player.play('move');
        this.player.rotation = Math.PI + game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y);
    } else {
        this.player.play('stop');
    }

    this.lastPosition.x = this.player.x;
    this.lastPosition.y = this.player.y;
};



// Find player by ID
function playerById(id) {
    var i;
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].player.name == id)
            return enemies[i];
    };

    return false;
};
