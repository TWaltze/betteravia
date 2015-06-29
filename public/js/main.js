Betteravia.main = function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO);

    game.state.add('startup', Betteravia.State.Startup);
    game.state.add('preloader', Betteravia.State.Preloader);
    game.state.add('game', Betteravia.State.Game);

    game.state.start('startup');
};

window.onload = function() {
    Betteravia.main();
};
