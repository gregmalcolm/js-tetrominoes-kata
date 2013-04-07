var app = tetrominoes;
app.gameState = app.gameState || {};

app.gameState.StartNewGame = {
    beget : function(game) {
        var that = Object.create(this);
        that.game = game;
        that.model = game.model;
        that.view = game.view;

        return that;
    },

    enter: function() {
        this.game.changeGameState("playing");
    },
    exit: function() {},
};
