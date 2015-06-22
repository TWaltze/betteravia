Player = function (game, map) {
    this.game = game;
    this.map = map;
    this.sprite = null;
};

Player.prototype = {
    preload: function() {
        game.load.spritesheet('dude', 'public/assets/dude.png', 64, 64);
    },

    create: function(index, x, y) {
        this.sprite = game.add.sprite(x, y, 'dude');
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
        this.sprite.animations.add('stop', [3], 20, true);

        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.name = index.toString();
        this.sprite.body.immovable = true;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.angle = game.rnd.angle();

        this.id = index.toString();
        this.health = 3;
        this.alive = true;

        this.lastPosition = {
            x: x,
            y: y
        }
    },

    update: function() {
        if(this.sprite.x != this.lastPosition.x || this.sprite.y != this.lastPosition.y) {
            this.sprite.play('move');
            this.sprite.rotation = Math.PI + game.physics.arcade.angleToXY(this.sprite, this.lastPosition.x, this.lastPosition.y);
        } else {
            this.sprite.play('stop');
        }

        this.lastPosition.x = this.sprite.x;
        this.lastPosition.y = this.sprite.y;
    }
}
