Player = function (game, map) {
    this.game = game;
    this.map = map;
    this.sprite = null;
};

Player.prototype = {
    preload: function() {
        // game.load.spritesheet('dude', 'public/assets/dude.png', 64, 64);

        game.load.spritesheet('characterAnim', 'public/images/tiles/characterAnim.png', 70, 74);
    },

    create: function(index, x, y, z) {
        // this.sprite = game.add.sprite(x, y, 'dude');
        // game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        //
        // this.sprite.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
        // this.sprite.animations.add('stop', [3], 20, true);
        //
        // this.sprite.anchor.setTo(0.5, 0.5);
        // this.sprite.name = index.toString();
        // this.sprite.body.immovable = true;
        // this.sprite.body.collideWorldBounds = true;
        // this.sprite.angle = game.rnd.angle();

        // Create the player
        this.sprite = this.game.add.isoSprite(x, y, z, 'characterAnim', 0, this.map.obstacleGroup);

        this.sprite.alpha = 0.6;

        this.sprite.name = index.toString();

        // add the animations from the spritesheet
        this.sprite.animations.add('S', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.sprite.animations.add('SW', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.sprite.animations.add('W', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
        this.sprite.animations.add('NW', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
        this.sprite.animations.add('N', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
        this.sprite.animations.add('NE', [40, 41, 42, 43, 44, 45, 46, 47], 10, true);
        this.sprite.animations.add('E', [48, 49, 50, 51, 52, 53, 54, 55], 10, true);
        this.sprite.animations.add('SE', [56, 57, 58, 59, 60, 61, 62, 63], 10, true);

        this.sprite.anchor.set(0.5);

        // enable physics on the player
        this.game.physics.isoArcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.immovable = true;

        this.id = index.toString();
        this.health = 3;
        this.alive = true;

        this.lastPosition = this.sprite.isoPosition;
    },

    update: function() {
        if(this.sprite.isoPosition.equals(this.lastPosition)) {
            // this.sprite.play('move');
            // this.sprite.rotation = Math.PI + game.physics.arcade.angleToXY(this.sprite, this.lastPosition.x, this.lastPosition.y);
        } else {
            // this.sprite.play('stop');
        }

        this.lastPosition = this.sprite.isoPosition;
    }
}
