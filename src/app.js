Object.prototype.beget = function() {
    return Object.create(this);
}

var tetrominoes = {};
var app = tetrominoes;

app.start = function() {
    var game = app.Game.beget();
    game.run();
};
