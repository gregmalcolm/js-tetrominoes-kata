var app = tetrominoes;

app.Game = {
    model : null,
    view : null,

    run : function() {
        this.model = app.model.Game.beget();
        this.view =  app.view.Game.beget(this.model);

        this.model.init(this.view);

        this.view.renderBackground();

        this.start();
    },

    start: function() {
        var self = this;

        setInterval(function() {
            return self.updateGame();
        }, 20);
    },

    updateGame: function() {
        this.view.render();
    }
}



