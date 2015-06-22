Map = function(game) {
    this.game = game;
    this.land = null;
}

Map.prototype = {
    preload: function() {
        game.load.image('earth', 'public/assets/light_sand.png');
    },

    create: function() {
        // Resize our game world to be a 2000 x 2000 square
        this.game.world.setBounds(-500, -500, 1000, 1000);

        // Our tiled scrolling background
        this.land = game.add.tileSprite(0, 0, 800, 600, 'earth');
        this.land.fixedToCamera = true;
    },

    update: function() {

    }
}
