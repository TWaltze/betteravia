Player = function (index, game, player, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    this.health = 3;
    this.alive = true;

    this.sprite = game.add.sprite(x, y, 'enemy');

    this.sprite.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
    this.sprite.animations.add('stop', [3], 20, true);

    this.sprite.anchor.setTo(0.5, 0.5);
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.name = index.toString();
    this.sprite.body.immovable = true;
    this.sprite.body.collideWorldBounds = true;

    this.sprite.angle = game.rnd.angle();

    this.lastPosition = { x: x, y: y }
};

Player.prototype.update = function() {
    if(this.sprite.x != this.lastPosition.x || this.sprite.y != this.lastPosition.y) {
        this.sprite.play('move');
        this.sprite.rotation = Math.PI + game.physics.arcade.angleToXY(this.sprite, this.lastPosition.x, this.lastPosition.y);
    } else {
        this.sprite.play('stop');
    }

    this.lastPosition.x = this.sprite.x;
    this.lastPosition.y = this.sprite.y;
};



// Find player by ID
function playerById(id) {
    var i;
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].sprite.name == id)
            return enemies[i];
    };

    return false;
};
