Betteravia.Player = function (game) {
    console.log("called Player");
    this.game = game;
    this.sprite = null;
};

Betteravia.Player.prototype = {
    preload: function() {
        // game.load.spritesheet('dude', 'public/assets/dude.png', 64, 64);

        this.game.load.spritesheet('characterAnim', 'public/images/tiles/characterAnim.png', 70, 74);
        this.game.load.spritesheet('player', 'public/assets/images/sprites/character2.png', 64, 64);
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
        console.log("Player", this);
        // this.sprite = this.game.add.sprite(x, y, 'characterAnim', 0);

        // this.sprite.alpha = 0.6;


        // add the animations from the spritesheet
        // this.sprite.animations.add('S', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        // this.sprite.animations.add('SW', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        // this.sprite.animations.add('W', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
        // this.sprite.animations.add('NW', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
        // this.sprite.animations.add('N', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
        // this.sprite.animations.add('NE', [40, 41, 42, 43, 44, 45, 46, 47], 10, true);
        // this.sprite.animations.add('E', [48, 49, 50, 51, 52, 53, 54, 55], 10, true);
        // this.sprite.animations.add('SE', [56, 57, 58, 59, 60, 61, 62, 63], 10, true);

        // this.sprite.anchor.set(0.5);

        // enable physics on the player
        // this.game.physics.isoArcade.enable(this.sprite);
        // this.sprite.body.collideWorldBounds = true;
        // this.sprite.body.immovable = true;


        this.sprite = this.game.add.sprite(x, y, 'player', 0);

        this.sprite.animations.add('N', [193, 194, 195, 196, 197, 198, 199, 200], 18, true);
        this.sprite.animations.add('NW', [217, 218, 219, 220, 221, 222, 223, 224], 18, true);
        this.sprite.animations.add('W', [217, 218, 219, 220, 221, 222, 223, 224], 18, true);
        this.sprite.animations.add('SW', [217, 218, 219, 220, 221, 222, 223, 224], 18, true);
        this.sprite.animations.add('S', [241, 242, 243, 244, 245, 246, 247, 248], 18, true);
        this.sprite.animations.add('SE', [265, 266, 267, 268, 269, 270, 271, 272], 18, true);
        this.sprite.animations.add('E', [265, 266, 267, 268, 269, 270, 271, 272], 18, true);
        this.sprite.animations.add('NE', [265, 266, 267, 268, 269, 270, 271, 272], 18, true);

        this.sprite.name = index.toString();

        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(32, 32, 16, 32);



        this.id = index.toString();
        this.health = 3;
        this.alive = true;

        this.nextPosition = null;
    },

    update: function() {
        if (this.nextPosition) {
            this.sprite.isoPosition.setTo(this.nextPosition.x, this.nextPosition.y, this.nextPosition.z);
            this.nextPosition = null;
        } else {
            // this.sprite.play('stop');
        }
    },

    render: function() {
        Betteravia.player.game.game.debug.body(Betteravia.player.sprite);
    }
}
