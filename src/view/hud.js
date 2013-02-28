var app = tetrominoes;
app.view = app.view || {};

app.view.Hud = {
    beget: function(view) {
        var that = Object.create(this);

        that.view = view;
		that.model = view.model;

        return that;
    },

    render: function() {
        player = app.game.model.player;
        ctx = this.view.context;
        well = this.view.well;

        ctx.font = "18pt Helvetica bold, sans-serif"
        ctx.fillStyle = "lightgrey";
        ctx.textAlign = "center";
        ctx.fillText("Score: " + player.score,
                     (well.right()/2) + well.margin().width,
                     well.top() - 10);
    },
};

