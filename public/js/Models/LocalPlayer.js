function LocalPlayer(game) {
    console.log("call right one");
    Betteravia.Player.call(this, game);
}

Betteravia.LocalPlayer = LocalPlayer;
Betteravia.LocalPlayer.prototype = Object.create(Betteravia.Player.prototype);
Betteravia.LocalPlayer.prototype.constructor = LocalPlayer;

Betteravia.LocalPlayer.prototype.create = function(index, x, y, z) {
    Betteravia.Player.prototype.create.call(this, index, x, y, z);

    // this.game.physics.isoArcade.enable(this.sprite);
    // this.sprite.body.collideWorldBounds = true;
    // this.sprite.body.immovable = true;

    this.game.camera.follow(this.sprite);

    // this.sprite.body.maxVelocity.setTo(400, 400);
    // this.sprite.body.immovable = false;
    // this.sprite.bringToTop();
}

Betteravia.LocalPlayer.prototype.update = function() {
    var _self = this;

    // remotePlayers.forEach(function(p) {
    //     if (p.alive) {
    //         p.update();
    //         if(space.isDown) {
    //             console.log("after update", p.sprite.isoPosition);
    //         }
    //         // game.physics.arcade.collide(_self.sprite, p.sprite);
    //     }
    // });

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
    var speed = 200;
    var animation = null;
    var velocity = {
        x: 0,
        y: 0,
        z: 0
    };

    if (Betteravia.cursors.down.isDown && Betteravia.cursors.right.isDown) {
        velocity.x = speed;
        animation = 'SE';
    } else if (Betteravia.cursors.down.isDown && Betteravia.cursors.left.isDown) {
        velocity.y = speed;
        animation = 'SW';
    } else if (Betteravia.cursors.up.isDown && Betteravia.cursors.left.isDown) {
        velocity.x = -speed;
        animation = 'NW';
    } else if (Betteravia.cursors.up.isDown && Betteravia.cursors.right.isDown) {
        velocity.y = -speed;
        animation = 'NE';
    } else if (Betteravia.cursors.up.isDown) {
        velocity.x = -speed;
        velocity.y = -speed
        animation = 'N';
    } else if (Betteravia.cursors.down.isDown) {
        velocity.x = speed;
        velocity.y = speed
        animation = 'S';
    } else if (Betteravia.cursors.right.isDown) {
        velocity.x = speed;
        velocity.y = -speed
        animation = 'E';
    } else if (Betteravia.cursors.left.isDown) {
        velocity.x = -speed;
        velocity.y = speed
        animation = 'W';
    }

    // var pointerAngle = game.physics.arcade.angleToPointer(this.sprite);
    //
    // if (0.5 < pointerAngle && pointerAngle < 1 && cursors.up.isDown) {
    //     velocity.x = speed;
    //     animation = 'SE';
    // } else if (2 < pointerAngle && pointerAngle < 2.5 && cursors.up.isDown) {
    //     velocity.y = speed;
    //     animation = 'SW';
    // } else if (-2.5 < pointerAngle && pointerAngle < -2 && cursors.up.isDown) {
    //     velocity.x = -speed;
    //     animation = 'NW';
    // } else if (-1 < pointerAngle && pointerAngle < -0.5 && cursors.up.isDown) {
    //     velocity.y = -speed;
    //     animation = 'NE';
    // } else if (-2 < pointerAngle && pointerAngle < -1 && cursors.up.isDown) {
    //     velocity.x = -speed;
    //     velocity.y = -speed
    //     animation = 'N';
    // } else if (1 < pointerAngle && pointerAngle < 2 && cursors.up.isDown) {
    //     velocity.x = speed;
    //     velocity.y = speed
    //     animation = 'S';
    // } else if (-0.5 < pointerAngle && pointerAngle < 0.5 && cursors.up.isDown) {
    //     velocity.x = speed;
    //     velocity.y = -speed
    //     animation = 'E';
    // } else if (2.5 < pointerAngle || pointerAngle < -2.5 && cursors.up.isDown) {
    //     velocity.x = -speed;
    //     velocity.y = speed
    //     animation = 'W';
    // }

    this.sprite.body.velocity.x = velocity.x;
    this.sprite.body.velocity.y = velocity.y;
    if (velocity.x === 0 && velocity.y === 0) {
        this.sprite.animations.stop();
    } else {
        this.sprite.animations.play(animation);
    }

    // socket.emit("move player", this.sprite.isoPosition);
}

Betteravia.LocalPlayer.prototype.render = function() {
    this.game.debug.body(this.sprite);
}
