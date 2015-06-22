function LocalPlayer(game, map) {
    Player.call(this, game, map);
}

LocalPlayer.prototype = Object.create(Player.prototype);
LocalPlayer.prototype.constructor = LocalPlayer;

LocalPlayer.prototype.create = function(index, x, y) {
    Player.prototype.create.call(this, index, x, y);

    this.sprite.body.maxVelocity.setTo(400, 400);
    this.sprite.body.immovable = false;
    this.sprite.bringToTop();

    console.log("LocalPlayer", this);
}

LocalPlayer.prototype.update = function() {
    var _self = this;

    remotePlayers.forEach(function(p) {
        if (p.alive) {
            p.update();
            game.physics.arcade.collide(_self.sprite, p.sprite);
        }
    });

    if (cursors.left.isDown) {
        player.sprite.angle -= 4;
    } else if (cursors.right.isDown) {
        player.sprite.angle += 4;
    }

    if (cursors.up.isDown) {
        //  The speed we'll travel at
        currentSpeed = 300;
    } else if (currentSpeed > 0) {
        currentSpeed -= 4;
    }

    if (currentSpeed > 0) {
        game.physics.arcade.velocityFromRotation(player.sprite.rotation, currentSpeed, player.sprite.body.velocity);

        player.sprite.animations.play('move');
    } else {
        player.sprite.animations.play('stop');
    }

    this.map.land.tilePosition.x = -this.game.camera.x;
    this.map.land.tilePosition.y = -this.game.camera.y;

    if (game.input.activePointer.isDown) {
        if (game.physics.arcade.distanceToPointer(player.sprite) >= 10) {
            currentSpeed = 300;

            player.sprite.rotation = game.physics.arcade.angleToPointer(player.sprite);
        }
    }

    socket.emit("move player", {
        x: player.sprite.x,
        y: player.sprite.y
    });
}
