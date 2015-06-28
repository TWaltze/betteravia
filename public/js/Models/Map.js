Map = function(game) {
    this.game = game;
    this.land = null;
    this.width = 2048;
    this.height = 1024;

    this.thing = null;

    this.tileSize = 35;
    this.mapSize = 30;
    this.level = [
        [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,1,0,4,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,0,0,1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,9,9,9,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,9,9,0,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],
        [0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,1,0,0,3,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
}

Map.prototype = {
    preload: function() {
        this.game.world.setBounds(0, 0, this.width, this.height);

        this.game.load.image('tile', 'public/images/tiles/ground_tile.png');

        this.game.load.image('cactus1', 'public/images/tiles/obstacle1.png');
        this.game.load.image('cactus2', 'public/images/tiles/obstacle2.png');
        this.game.load.image('rock', 'public/images/tiles/obstacle3.png');

        this.game.load.image('grass1', 'public/images/tiles/ground_tile_grass1.png');
        this.game.load.image('grass2', 'public/images/tiles/ground_tile_grass2.png');
        this.game.load.image('grass3', 'public/images/tiles/ground_tile_grass3.png');

        this.game.load.spritesheet('characterAnim', 'public/images/tiles/characterAnim.png', 70, 74);
    },

    create: function() {
        // set the Background color of our game
    	this.game.stage.backgroundColor = "0xde6712";

        this.floorGroup = this.game.add.group();
        this.itemGroup = this.game.add.group();
        this.grassGroup = this.game.add.group();
        this.obstacleGroup = this.game.add.group();

        // set the gravity in our game
    	game.physics.isoArcade.gravity.setTo(0, 0, -500);

        // create the floor tiles
        var floorTile;
        for (var xt = 0; xt < this.mapSize * this.tileSize; xt += this.tileSize) {
            for (var yt = 0; yt < this.mapSize * this.tileSize; yt += this.tileSize) {
                floorTile = this.game.add.isoSprite(xt, yt, 0, 'tile', 0, this.floorGroup);
                floorTile.anchor.set(0.5);
            }
        }

        // create the grass tiles randomly
        var grassTile;
        for (var xt = 0; xt < this.mapSize * this.tileSize; xt += this.tileSize) {
	        for (var yt = 0; yt < this.mapSize * this.tileSize; yt += this.tileSize) {

                var rnd = rndNum(20);

                if (rnd == 0) {
                    grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass1', 0, this.grassGroup);
                    grassTile.anchor.set(0.5);
                }
                else if (rnd == 1)
                {
                    grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass2', 0, this.grassGroup);
                    grassTile.anchor.set(0.5);
                }
                else if (rnd == 2)
                {
                    grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass3', 0, this.grassGroup);
                    grassTile.anchor.set(0.5);
                }
            }
        }

        var obstacle;
        for (var yt = 0; yt < this.level.length; yt++) {
            var tile = this.level[yt];

            for (var xt = 0; xt < this.level[yt].length; xt++) {
                var obstacleType = null;

                if (tile[xt] == 1) {
                    obstacleType = 'cactus1';
                } else if (tile[xt] == 2) {
                    obstacleType = 'cactus2';
                } else if (tile[xt] == 3) {
                    obstacleType = 'rock'
                }

                if (obstacleType) {
                    obstacle = this.game.add.isoSprite(xt * this.tileSize, yt * this.tileSize, 0, obstacleType, 0, this.obstacleGroup);

                    obstacle.anchor.set(0.5);

                    // Let the physics engine do its job on this tile type
                    this.game.physics.isoArcade.enable(obstacle);

                    // This will prevent our physic bodies from going out of the screen
                    obstacle.body.collideWorldBounds = true;

                    // Make the obstacle body immovable
                    obstacle.body.immovable = true;
                }
            }
        }

        // this.thing = this.game.add.isoSprite(80, 80, 0, 'rock', 0);
        // this.thing.anchor.set(0.5);
        //
        // // Let the physics engine do its job on this tile type
        // this.game.physics.isoArcade.enable(this.thing);
        //
        // // This will prevent our physic bodies from going out of the screen
        // this.thing.body.collideWorldBounds = true;
        // this.thing.body.immovable = true;
        // this.thing.body.maxVelocity.setTo(0, 0);
        // this.thing.body.bounce.set(0, 0, 0);
        // set the physics bounce amount on each axis  (X, Y, Z)
        // this.thing.body.bounce.set(0.2, 0.2, 0);

        // set the slow down rate on each axis (X, Y, Z)
        // this.thing.body.drag.set(100, 100, 0);
    },

    update: function() {
        this.game.physics.isoArcade.collide(this.obstacleGroup);
        this.game.iso.topologicalSort(this.obstacleGroup);
    }
}

// generate random number
function rndNum(num) {
    return Math.round(Math.random() * num);
}
