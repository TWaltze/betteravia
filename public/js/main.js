Betteravia.main = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var game = new Phaser.Game(width, height, Phaser.AUTO);

    game.state.add('startup', Betteravia.State.Startup);
    game.state.add('preloader', Betteravia.State.Preloader);
    game.state.add('game', Betteravia.State.Game);

    game.state.start('startup');
};

window.onload = function() {
    Betteravia.main();
};
