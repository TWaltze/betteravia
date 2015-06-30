Betteravia.Map = function(game) {
    this.game = game;
    this.land = null;
    this.width = 2048;
    this.height = 1024;

    // this.thing = null;
    //
    // this.tileSize = 35;
    // this.mapSize = 30;
    // this.level = [
    //     [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
    //     [0,1,0,4,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,2,0,0,1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,9,9,9,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,9,9,0,0,0,0],
    //     [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,3,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],
    //     [0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,1,0,0,3,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    //     [0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
    // ];

    this.land = [
        // Overworld maps
        'home_village_f0',

        // Modules used in maps
        'house0_f0'
    ];

    this.modules = {};
    this.subMaps = {};
    this.overworld = this.land[0];
    this.ground = null;
}

Betteravia.Map.prototype = {
    preload: function() {
        this.game.world.setBounds(0, 0, this.width, this.height);

        // this.game.load.image('tile', 'public/images/tiles/ground_tile.png');
        //
        // this.game.load.image('cactus1', 'public/images/tiles/obstacle1.png');
        // this.game.load.image('cactus2', 'public/images/tiles/obstacle2.png');
        // this.game.load.image('rock', 'public/images/tiles/obstacle3.png');
        //
        // this.game.load.image('grass1', 'public/images/tiles/ground_tile_grass1.png');
        // this.game.load.image('grass2', 'public/images/tiles/ground_tile_grass2.png');
        // this.game.load.image('grass3', 'public/images/tiles/ground_tile_grass3.png');
        //
        // this.game.load.spritesheet('characterAnim', 'public/images/tiles/characterAnim.png', 70, 74);

        // Load the json maps, so we can load the images in the next steps.
        var map;
        for (var i = 0; i < this.land.length; i++) {
            map = this.land[i];
            this.game.load.tilemap(map, 'public/assets/maps/' + map + '.json', null, Phaser.Tilemap.TILED_JSON);
        }
    },

    create: function() {
        // // Set the Background color for this map
    	// this.game.stage.backgroundColor = "0xde6712";
        //
        // this.floorGroup = this.game.add.group();
        // this.grassGroup = this.game.add.group();
        // this.obstacleGroup = this.game.add.group();
        // this.itemGroup = this.game.add.group();
        //
        // // Set the gravity for this map
    	// this.game.physics.isoArcade.gravity.setTo(0, 0, -500);
        //
        // // Create the floor tiles
        // var floorTile;
        // for (var xt = 0; xt < this.mapSize * this.tileSize; xt += this.tileSize) {
        //     for (var yt = 0; yt < this.mapSize * this.tileSize; yt += this.tileSize) {
        //         floorTile = this.game.add.isoSprite(xt, yt, 0, 'tile', 0, this.floorGroup);
        //         floorTile.anchor.set(0.5);
        //     }
        // }
        //
        // // Create the grass tiles randomly
        // var grassTile;
        // for (var xt = 0; xt < this.mapSize * this.tileSize; xt += this.tileSize) {
	    //     for (var yt = 0; yt < this.mapSize * this.tileSize; yt += this.tileSize) {
        //
        //         var rnd = rndNum(20);
        //
        //         if (rnd == 0) {
        //             grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass1', 0, this.grassGroup);
        //             grassTile.anchor.set(0.5);
        //         }
        //         else if (rnd == 1)
        //         {
        //             grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass2', 0, this.grassGroup);
        //             grassTile.anchor.set(0.5);
        //         }
        //         else if (rnd == 2)
        //         {
        //             grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass3', 0, this.grassGroup);
        //             grassTile.anchor.set(0.5);
        //         }
        //     }
        // }
        //
        // // Add obstacles
        // var obstacle;
        // for (var yt = 0; yt < this.level.length; yt++) {
        //     var tile = this.level[yt];
        //
        //     for (var xt = 0; xt < this.level[yt].length; xt++) {
        //         var obstacleType = obstacleLookup(tile[xt]);
        //
        //         if (obstacleType) {
        //             obstacle = this.game.add.isoSprite(xt * this.tileSize, yt * this.tileSize, 0, obstacleType, 0, this.obstacleGroup);
        //
        //             obstacle.anchor.set(0.5);
        //
        //             // Let the physics engine do its job on this tile type
        //             this.game.physics.isoArcade.enable(obstacle);
        //
        //             // This will prevent our physic bodies from going out of the screen
        //             obstacle.body.collideWorldBounds = true;
        //
        //             // Make the obstacle body immovable
        //             obstacle.body.immovable = true;
        //         }
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

        for (var i = 0; i < this.land.length; i++) {
            var m = this.land[i];
            this.modules[m] = new Betteravia.Map.Module(this.game, m);
        }

        // We manually add the over world ground for now...
        this.ground = this.modules[this.overworld].createLayer('ground');

        // Resize the game world to match the layer dimensions
        this.ground.resizeWorld();

        // Place the subMaps
        var subMapLocations = this.modules[this.overworld].findObjectsByType('sub_map');
        var location, tileX, tileY;
        for (var i = 0; i < subMapLocations.length; i++) {
            location = subMapLocations[i];
            tileX = location.x / 32;
            tileY = location.y / 32;

            this.subMaps[location.name] = new Betteravia.Map.SubMap(
                this.modules[location.properties.sub_map],
                tileX,
                tileY
            );
        }

        this.subMaps['home0'].setIndoorAlpha(0);

        // Place some objects
        this.doorGroup = this.game.add.group();
        var tiledDoors = this.modules[this.overworld].findObjectsByType('door');
        this.doors = {};
        var doorSprite = this.modules[this.overworld].spriteFromObject(tiledDoors[0], this.doorGroup);
        Betteravia.Map.Object.Door.init(this.game);
        this.doors[doorSprite.properties.id] = new Betteravia.Map.Object.Door(this.game, doorSprite);

        // Collision map!
        this.isOutdoors = true;
        this.indoor_walls = this.game.add.group();
        this.outdoor_walls = this.game.add.group();
        var home0 = this.subMaps['home0'];
        this.inCollisionObjects = this.modules['house0_f0'].getCollisionSprites(
            'collision_indoors', this.indoor_walls, home0.tileX, home0.tileY);
        this.outCollisionObjects = this.modules['house0_f0'].getCollisionSprites(
            'collision_outdoors', this.outdoor_walls, home0.tileX, home0.tileY);
    },

    // Many of the maps use the same tile images. We create a map of all these images
    // so that we only load them once.
    loadTileMaps: function() {
        var tileSetMap = {};
        for (var i = 0; i < this.land.length; i++) {
            this.addTileSets(this.land[i], tileSetMap);
        }

        for (var key in tileSetMap) {
            if (tileSetMap.hasOwnProperty(key)) {
                this.game.load.image(key, tileSetMap[key]);
            }
        }
    },

    addTileSets: function(mapKey, tileSetMap) {
        var tileSets = this.game.cache.getTilemapData(mapKey).data.tilesets;
        var key, value;

        for (var i = 0; i < tileSets.length; i++) {
            key = tileSets[i].name;
            value = 'public/assets/maps/' + tileSets[i].image;

            if (key in tileSetMap) continue;

            tileSetMap[key] = value;
        }
    },

    update: function() {
        // this.game.physics.isoArcade.collide(this.obstacleGroup);
        // this.game.iso.topologicalSort(this.obstacleGroup);

        // Check if we're overlapping the door.
        this.game.physics.arcade.overlap(Betteravia.player.sprite, this.doorGroup, Betteravia.Map.Object.Door.handler, null, this);
        if (this.isOutdoors) {
            this.game.physics.arcade.collide(Betteravia.player.sprite, this.outdoor_walls);
        } else {
            this.game.physics.arcade.collide(Betteravia.player.sprite, this.indoor_walls);
        }
    },

    render: function() {
        // this.inCollisionObjects.forEach(function(obj) {
        //     Betteravia.map.game.game.debug.body(obj);
        // });
    }
}

Betteravia.Map.Object = {};
