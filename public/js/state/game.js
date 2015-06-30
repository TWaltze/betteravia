/**
 * Created by knash on 15-03-12.
 */

Betteravia.State.Game = function(game) {};
Betteravia.State.Game.prototype = {
    create: function() {
        Betteravia.map.create();

        // Make our player
        var spawn = Betteravia.map.modules[Betteravia.map.overworld].findObjectsByType('player_spawn');
        Betteravia.player.create('foobar', spawn[0].x + 4, spawn[0].y - 16, 0);

        // Input
        Betteravia.cursors = this.game.input.keyboard.createCursorKeys();
    },

    // This is called by the physics overlap function during the update
    // doorHandler: function(player, doorSprite) {
    //     var door = this.doors[doorSprite.properties.id];
    //
    //     // This will update the doors "delta", telling us how far over the player is.
    //     door.overlapTrigger(player);
    //
    //     var alpha = door.delta;
    //     this.subMaps[doorSprite.properties.parent].setIndoorAlpha(alpha);
    //     this.subMaps[doorSprite.properties.parent].setOutdoorAlpha(1 - alpha);
    //     this.isOutdoors = !door.isOpen();
    // },

    update: function() {
        // // Collision
        //
        // // Check if we're overlapping the door.
        // this.game.physics.arcade.overlap(this.player, this.doorGroup, this.doorHandler, null, this);
        // if (this.isOutdoors) {
        //     this.game.physics.arcade.collide(this.player, this.outdoor_walls);
        // } else {
        //     this.game.physics.arcade.collide(this.player, this.indoor_walls);
        // }
        //
        // // Player movement
        // this.player.body.velocity.y = 0;
        // this.player.body.velocity.x = 0;
        //
        // if (this.cursors.up.isDown) {
        //     this.player.body.velocity.y -= 200;
        // } else if (this.cursors.down.isDown) {
        //     this.player.body.velocity.y += 200;
        // }
        //
        // if (this.cursors.left.isDown) {
        //     this.player.body.velocity.x -= 200;
        // } else if (this.cursors.right.isDown) {
        //     this.player.body.velocity.x += 200;
        // }

        Betteravia.player.update();
        Betteravia.map.update();
    },

    render: function() {
        Betteravia.player.render();
        Betteravia.map.render();
    }
};
