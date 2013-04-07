var app = tetrominoes;
app.gameState = app.gameState || {};

app.gameState.GameOver = {
    beget : function(game) {
        var that = Object.create(this);
        that.game = game;
        that.model = game.model;
        that.view = game.view;

        return that;
    },

    enter: function() {},
    exit: function() {},
};
