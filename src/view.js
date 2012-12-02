var app = tetrominoes;
app.view = {};
var view = app.view;

view.Game = {
    model: null,

    canvas: null,
    context: null,

    well: null,
    player: null,

    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.canvas = $('canvas#mainGame')[0]
        that.context = that.canvas.getContext('2d');
        that.well = view.Well.beget(that);
        that.player = view.Player.beget(that);

        return that;
    },

    clear: function() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    renderBackground: function() {
        this.clear();
        this.well.render();
    },

    render: function() {
        this.player.render();
    },
};

view.Well = {
    view: null,

    beget: function(view) {
        var that = Object.create(this);

        that.view = view;

        return that;
    },

    render: function() {
        this.view.context.fillStyle = '#CCC';

        var blockWidth  = this.view.model.blockWidth;
        var blockHeight = this.view.model.blockHeight;
        var width       = this.view.model.widthInBlocks;
        var height      = this.view.model.heightInBlocks;

        this.view.context
                .fillRect(blockWidth,
                          blockHeight,
                          blockWidth + 1,
                          (blockHeight * (height - 2)) + 1);

        this.view.context
                .fillRect(blockWidth * 2,
                          blockHeight * (height - 2),
                          (blockWidth * (width - 4)) + 1,
                          blockHeight + 1);

        this.view.context
                .fillRect(blockWidth * (width - 2),
                          blockHeight,
                          blockWidth + 1,
                           (blockHeight * (height - 2)) + 1);
    }
};

view.Player = {
    view: null,

    beget: function(view) {
        var that = Object.create(this);

        that.view = view;

        return that;
    },

    render: function() {
        this.view.context.fillstyle = 'yellow';

        var blockWidth  = this.view.model.blockWidth;
        var blockHeight = this.view.model.blockHeight;

        this.view.context.fillRect(blockWidth * 6,
                                   blockHeight * 6,
                                   blockWidth + 1,
                                   blockHeight + 1);
    },
}
