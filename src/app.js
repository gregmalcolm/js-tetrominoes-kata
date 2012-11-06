Object.prototype.beget = function() {
    return Object.create(this);
}

var tetrominoes = {
    game: null,
    start: function() {
        this.game = app.Game.beget();
        this.game.run();
    }
};

var app = tetrominoes;

