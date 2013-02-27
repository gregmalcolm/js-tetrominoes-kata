var app = tetrominoes;
app.view = app.view || {};

app.view.Game = {
    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.canvas = $('canvas#mainGame')[0]
        that.context = that.canvas.getContext('2d');

		that.well = app.view.Well.beget(that);
        that.player = app.view.Player.beget(that);
        that.blocks = app.view.Blocks.beget(that);

        return that;
    },

    render: function() {
        this.renderBackground();
        this.blocks.render();
        this.player.render();
    },

    clear: function() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    renderBackground: function() {
        this.clear();
        this.well.render();
    },
};
