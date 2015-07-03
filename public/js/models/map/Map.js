Betteravia.Map = function(game) {
    this.game = game;
    this.land = null;
    this.width = 2048;
    this.height = 1024;

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

    this.MAP_KEYS = {
        door: 'door',
        ground: 'ground',
        obstacles: 'obstacles',
        subMap: 'sub_map',
        playerSpawnPoint: 'player_spawn',
        collision: {
            general: 'collision',
            indoor: 'collision_indoors',
            outdoor: 'collision_outdoors'
        }
    };
}

Betteravia.Map.prototype = {
    preload: function() {
        // this.game.world.setBounds(0, 0, this.width, this.height);

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

        for (var i = 0; i < this.land.length; i++) {
            var m = this.land[i];
            this.modules[m] = new Betteravia.Map.Module(this.game, m);
        }

        // We manually add the over world ground for now...
        this.ground = this.modules[this.overworld].createLayer(this.MAP_KEYS.ground);
        this.obstacles = this.modules[this.overworld].createLayer(this.MAP_KEYS.obstacles);

        // Resize the game world and its bounding to match the layer's dimensions
        this.ground.resizeWorld();

        // Place the subMaps
        var subMapLocations = this.modules[this.overworld].findObjectsByType(this.MAP_KEYS.subMap);
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

            this.subMaps[location.name].setIndoorAlpha(0);
        }


        // Place some objects
        this.doorGroup = this.game.add.group();
        var tiledDoors = this.modules[this.overworld].findObjectsByType(this.MAP_KEYS.door);
        this.doors = {};
        for (var i = 0; i < tiledDoors.length; i++) {
            var doorSprite = this.modules[this.overworld].spriteFromObject(tiledDoors[i], this.doorGroup);
            // Betteravia.Map.Object.Door.init(this.game);
            this.doors[doorSprite.properties.id] = new Betteravia.Map.Object.Door(this.game, doorSprite);
        }

        // Collision map!
        this.isOutdoors = true;
        this.indoorCollision = this.game.add.group();
        this.outdoorCollision = this.game.add.group();
        this.generalCollision = this.game.add.group();

        console.log("subMaps", this.subMaps);
        console.log("modules", this.modules);
        for (var key in this.subMaps) {
            if (!this.subMaps.hasOwnProperty(key)) {
                continue;
            }

            var sub = this.subMaps[key];

            sub.module.getCollisionSprites(
                this.MAP_KEYS.collision.indoor,
                this.indoorCollision,
                sub.tileX,
                sub.tileY
            );

            sub.module.getCollisionSprites(
                this.MAP_KEYS.collision.outdoor,
                this.outdoorCollision,
                sub.tileX,
                sub.tileY
            );

            sub.module.getCollisionSprites(
                this.MAP_KEYS.collision.general,
                this.generalCollision,
                sub.tileX,
                sub.tileY
            );
        }

        this.modules[this.overworld].getCollisionSprites(
            this.MAP_KEYS.collision.indoor,
            this.indoorCollision
        );

        this.modules[this.overworld].getCollisionSprites(
            this.MAP_KEYS.collision.outdoor,
            this.outdoorCollision
        );

        this.modules[this.overworld].getCollisionSprites(
            this.MAP_KEYS.collision.general,
            this.generalCollision
        );
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
        // Check if we're overlapping the door.
        this.game.physics.arcade.overlap(Betteravia.player.sprite, this.doorGroup, Betteravia.Map.Object.Door.handler, null, this);

        this.game.physics.arcade.collide(Betteravia.player.sprite, this.generalCollision);

        if (this.isOutdoors) {
            this.game.physics.arcade.collide(Betteravia.player.sprite, this.outdoorCollision);
        } else {
            this.game.physics.arcade.collide(Betteravia.player.sprite, this.indoorCollision);
        }
    },

    render: function() {
        // this.generalCollision.children.forEach(function(obj) {
        //     Betteravia.map.game.game.debug.body(obj);
        // });
    },

    getPlayerSpawnPoint: function() {
        return this.modules[this.overworld].findObjectsByType(this.MAP_KEYS.playerSpawnPoint);
    }
}

Betteravia.Map.Object = {};
