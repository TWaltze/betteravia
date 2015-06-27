function LocalPlayer(game, map) {
    Player.call(this, game, map);
}

LocalPlayer.prototype = Object.create(Player.prototype);
LocalPlayer.prototype.constructor = LocalPlayer;

LocalPlayer.prototype.create = function(index, x, y, z) {
    Player.prototype.create.call(this, index, x, y, z);

    this.game.camera.follow(this.sprite);

    // this.sprite.body.maxVelocity.setTo(400, 400);
    this.sprite.body.immovable = false;
    // this.sprite.bringToTop();
}

LocalPlayer.prototype.update = function() {
    var _self = this;

    remotePlayers.forEach(function(p) {
        if (p.alive) {
            p.update();
            // game.physics.arcade.collide(_self.sprite, p.sprite);
        }
    });

    // if (cursors.left.isDown) {
    //     player.sprite.angle -= 4;
    // } else if (cursors.right.isDown) {
    //     player.sprite.angle += 4;
    // }
    //
    // if (cursors.up.isDown) {
    //     //  The speed we'll travel at
    //     currentSpeed = 300;
    // } else if (currentSpeed > 0) {
    //     currentSpeed -= 4;
    // }
    //
    // if (currentSpeed > 0) {
    //     game.physics.arcade.velocityFromRotation(player.sprite.rotation, currentSpeed, player.sprite.body.velocity);
    //
    //     player.sprite.animations.play('move');
    // } else {
    //     player.sprite.animations.play('stop');
    // }
    //
    // this.map.land.tilePosition.x = -this.game.camera.x;
    // this.map.land.tilePosition.y = -this.game.camera.y;
    //
    // if (game.input.activePointer.isDown) {
    //     if (game.physics.arcade.distanceToPointer(player.sprite) >= 10) {
    //         currentSpeed = 300;
    //
    //         player.sprite.rotation = game.physics.arcade.angleToPointer(player.sprite);
    //     }
    // }

    // Move the player
    var speed = 100;

    if (cursors.up.isDown) {
    	this.sprite.body.velocity.y = -speed;
        this.sprite.body.velocity.x = -speed;
        this.sprite.animations.play('N');
    } else if (cursors.down.isDown) {
        this.sprite.body.velocity.y = speed;
        this.sprite.body.velocity.x = speed;
        this.sprite.animations.play('S');
    } else if (cursors.right.isDown) {
        this.sprite.body.velocity.x = speed;
        this.sprite.body.velocity.y = -speed;
        this.sprite.animations.play('E');
    } else if (cursors.left.isDown) {
        this.sprite.body.velocity.x = -speed;
        this.sprite.body.velocity.y = speed;
        this.sprite.animations.play('W');
    } else if (cursors.down.isDown && cursors.right.isDown) {
        this.sprite.body.velocity.x = speed;
        this.sprite.body.velocity.y = 0;
        this.sprite.animations.play('SE');
    } else if (cursors.down.isDown && cursors.left.isDown) {
        this.sprite.body.velocity.y = speed;
        this.sprite.body.velocity.x = 0;
        this.sprite.animations.play('SW');
    } else if (cursors.up.isDown && cursors.left.isDown) {
        this.sprite.body.velocity.x = -speed;
        this.sprite.body.velocity.y = 0;
        this.sprite.animations.play('NW');
    } else if (cursors.up.isDown && cursors.right.isDown) {
        this.sprite.body.velocity.y = -speed;
        this.sprite.body.velocity.x = 0;
        this.sprite.animations.play('NE');
    } else {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.animations.stop();
    }

    socket.emit("move player", this.sprite.isoPosition);
}
