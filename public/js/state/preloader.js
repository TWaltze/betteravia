Betteravia.State.Preloader = function(game) {};
Betteravia.State.Preloader.prototype = {
    preload: function() {
        console.log("game", this);
        console.log("Betteravia", Betteravia);

        // Black loading screen
        this.game.stage.backgroundColor = '#000000';

        this.game.add.sprite(492, 175, 'loading_text');
        this.game.add.sprite(120, 580, 'loading_bar_bg');
        this.preloadBar = this.add.sprite(140, 600, 'loading_bar');
        this.game.add.sprite(140, 600, 'loading_bar_fg');
        this.game.load.setPreloadSprite(this.preloadBar);

        // Load our sprites
        // this.load.image('player', 'res/img/sprites/player.png');
        this.load.image('door', 'public/assets/img/sprites/door.png');
        this.load.image('stairs', 'public/assets/img/sprites/stairs.png');
        Betteravia.player = new Betteravia.LocalPlayer(this.game);
        Betteravia.player.preload();

        // Load all of our maps and their components.
        Betteravia.map.loadTileMaps();
    },

    create: function() {
        this.game.state.start('game');
    }
};
