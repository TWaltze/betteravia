Map = function(game) {
    this.game = game;
    this.land = null;
    this.width = 2048 * .5;
    this.height = 1024 * .5;

    this.thing = null;
}

Map.prototype = {
    preload: function() {
        this.game.world.setBounds(0, 0, this.width, this.height);

        // game.load.image('earth', 'public/assets/light_sand.png');

        this.game.load.image('cactus1', 'public/images/tiles/obstacle1.png');
        this.game.load.image('cactus2', 'public/images/tiles/obstacle2.png');
        this.game.load.image('rock', 'public/images/tiles/obstacle3.png');

        this.game.load.image('gold', 'public/images/tiles/find1_gold.png');
        this.game.load.image('revolver', 'public/images/tiles/find2_revolver.png');
        this.game.load.image('badge', 'public/images/tiles/find3_badge.png');
        this.game.load.image('skull', 'public/images/tiles/find4_skull.png');

        this.game.load.image('exit', 'public/images/tiles/exit.png');
        this.game.load.image('tile', 'public/images/tiles/ground_tile.png');

        this.game.load.image('grass1', 'public/images/tiles/ground_tile_grass1.png');
        this.game.load.image('grass2', 'public/images/tiles/ground_tile_grass2.png');
        this.game.load.image('grass3', 'public/images/tiles/ground_tile_grass3.png');

        this.game.load.image('mine', 'public/images/tiles/mine.png');

        this.game.load.spritesheet('characterAnim', 'public/images/tiles/characterAnim.png', 70, 74);
    },

    create: function() {
        // Resize our game world to be a 2000 x 2000 square
        // this.game.world.setBounds(-500, -500, 1000, 1000);

        // Our tiled scrolling background
        // this.land = game.add.tileSprite(0, 0, 800, 600, 'earth');
        // this.land.fixedToCamera = true;

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
        for (var xt = this.height; xt > 0; xt -= 35) {
            for (var yt = this.height; yt > 0; yt -= 35) {
            	floorTile = this.game.add.isoSprite(xt, yt, 0, 'tile', 0, this.floorGroup);
            	floorTile.anchor.set(0.5);

            }
        }

        // create the grass tiles randomly
        var grassTile;
        for (var xt = this.height; xt > 0; xt -= 35) {
            for (var yt = this.height; yt > 0; yt -= 35) {

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

        // create an immovable cactus tile and randomly choose one of two graphical cactus representations
        // var cactus1;
        // for (var xt = this.height; xt > 0; xt -= 400) {
        //     for (var yt = this.height; yt > 0; yt -= 400) {
        //
        //     	var rnd = rndNum(1);
        //
        //     	if (rnd == 0) {
        //     		cactus1 = this.game.add.isoSprite(xt, yt, 0, 'cactus1', 0, this.obstacleGroup);
        //     	}
        //     	else
        //     	{
        //     		cactus1 = this.game.add.isoSprite(xt, yt, 0, 'cactus2', 0, this.obstacleGroup);
        //     	}
        //
        //     	cactus1.anchor.set(0.5);
        //
        //         // Let the physics engine do its job on this tile type
        //         this.game.physics.isoArcade.enable(cactus1);
        //
        //         // This will prevent our physic bodies from going out of the screen
        //         cactus1.body.collideWorldBounds = true;
        //
        //         // Make the cactus body immovable
        //         cactus1.body.immovable = true;
        //
        //     }
        // }
        //
        // var rock;
        // for (var xt = this.height; xt > 0; xt -= 400) {
        //     for (var yt = this.height; yt > 0; yt -= 400) {
        //
        //     	rock = this.game.add.isoSprite(xt + 80, yt + 80, 0, 'rock', 0, this.obstacleGroup);
        //     	rock.anchor.set(0.5);
        //
        //     	// Let the physics engine do its job on this tile type
        //         this.game.physics.isoArcade.enable(rock);
        //
        //         // This will prevent our physic bodies from going out of the screen
        //         rock.body.collideWorldBounds = true;
        //
        //         // set the physics bounce amount on each axis  (X, Y, Z)
        //         rock.body.bounce.set(0.2, 0.2, 0);
        //
        //         // set the slow down rate on each axis (X, Y, Z)
        //         rock.body.drag.set(100, 100, 0);
        //     }
        // }

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
