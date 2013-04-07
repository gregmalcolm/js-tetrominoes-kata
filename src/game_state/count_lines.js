var app = tetrominoes;
app.gameState = app.gameState || {};

app.gameState.CountLines = {
    beget : function(game) {
        var that = Object.create(this);
        that.game = game;
        that.model = game.model;
        that.view = game.view;

        return that;
    },

    enter: function() {
        this.scoring = this.model.player.lastScoring;
        if (this.scoring.score === 0 ) {
            this.game.changeGameState("playing");
        };
    },
    exit: function() {},
};
