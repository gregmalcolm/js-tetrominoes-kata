Object.prototype.beget = function() {
    return Object.create(this);
}

var tetrominoes = {};
var app = tetrominoes;
app.view = {};
app.model = {};

app.start = function() {
    game = app.game.run();
};
