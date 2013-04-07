var app = tetrominoes;

app.Game = {
    model : null,
    view : null,
    gameStateName : null,
    gameStates : {},

    beget : function() {
        var that = Object.create(this);

        that.model = app.model.Game.beget(that);
        that.view = app.view.Game.beget(that.model);

        that.gameStates = that._createGameStates(that);

        that.model.init(that.view);

        return that;
    },

    gameState : function() {
        return this.gameStateName ? this.gameStates[this.gameStateName] : null;

    },

    changeGameState : function(stateName) {
        if(this.gameStateName) {
            this.gameState().exit();
        }
        this.gameStateName = stateName;
        this.gameState().enter();
        return this.gameState();
    },

    run : function() {
        this.changeGameState("startNewGame");
    },


    _createGameStates : function(game) {
        var that = {
            startNewGame : app.gameState.StartNewGame.beget(game),
            playing      : app.gameState.Playing.beget(game),
            countLines   : app.gameState.CountLines.beget(game),
            gameOver     : app.gameState.GameOver.beget(game),
        };
        return that;
    },
}
