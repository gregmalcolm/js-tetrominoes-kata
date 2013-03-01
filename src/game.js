var app = tetrominoes;

app.Game = {
    model : null,
    view : null,
    gameStateName : null,
    gameStates : {},

    beget : function() {
        var that = Object.create(this);

        that.model = app.model.Game.beget();
        that.view = app.view.Game.beget(that.model);

        that.gameStates = that._createGameStates();

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
        this.changeGameState("playing");
    },


    _createGameStates : function() {
        var that = this;
        var gameState = app.gameState;
        var that = {
            playing    : gameState.Playing.beget(that),
            countLines : gameState.CountLines.beget(that),
        };
        return that;
    },
}
