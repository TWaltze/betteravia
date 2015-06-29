// Setup our namespaces and resource lists.
Betteravia = {
    game: null,
    player: null,
    map: null,
    cursors: null,
};

Betteravia.State = {};
Betteravia.Map = {};
Betteravia.Map.Object = {};

Betteravia.State.Startup = function(game) {};
Betteravia.State.Startup.prototype = {
    preload: function() {
        // Load our "loading" images
        this.load.image('loading_text', 'public/assets/img/loading_text.png');
        this.load.image('loading_bar_bg', 'public/assets/img/loading_bar_bg.png');
        this.load.image('loading_bar', 'public/assets/img/loading_bar.png');
        this.load.image('loading_bar_fg', 'public/assets/img/loading_bar_fg.png');

        // Load the json maps, so we can load the images in the next steps.
        Betteravia.map = new Betteravia.Map(this);
        Betteravia.map.preload();
    },

    create: function() {
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.state.start('preloader');
    }
};
