var tetrominoes = {};
var app = tetrominoes;

app.game = {
    start: function() {
        this.view.init();
        this.model.init(this.view);

        this.view.renderBackground();
    }
}

app.model = {};
app.game.model = {
    canvasWidth: undefined,
    canvasHeight: undefined,
    blockWidth: undefined,
    blockHeight: undefined,
    widthInBlocks: 12,
    heightInBlocks: 17,

    init: function(view) {
        this.canvasWidth  = view.canvas.width;
        this.canvasHeight = view.canvas.height;
        this.blockWidth  = this.canvasWidth  / this.widthInBlocks;
        this.blockHeight = this.canvasHeight / this.heightInBlocks;
    }
};

app.view = {};

app.view.well = {
    view: function() {
        return app.game.view;
    },

    model: function() {
        return app.game.model;
    },

    render: function() {
        this.view().context.fillStyle = '#CCC';

        var blockWidth  = this.model().blockWidth;
        var blockHeight = this.model().blockHeight;
        var width       = this.model().widthInBlocks;
        var height      = this.model().heightInBlocks;

        this.view().context
                   .fillRect(blockWidth,
                             blockHeight,
                             blockWidth + 1,
                             (blockHeight * (height - 2)) + 1);

        this.view().context
                   .fillRect(blockWidth * 2,
                             blockHeight * (height - 2),
                             (blockWidth * (width - 4)) + 1,
                             blockHeight + 1);

        this.view().context
                   .fillRect(blockWidth * (width - 2),
                             blockHeight,
                             blockWidth + 1,
                             (blockHeight * (height - 2)) + 1);
    }
}

app.game.view = {
    canvas: undefined,
    context: undefined,

    well: app.view.well,

    init: function() {
        this.canvas = $('canvas#mainGame')[0]
        this.context = this.canvas.getContext('2d');
    },

    clear: function() {
      this.context.fillStyle  = 'black';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    renderBackground: function() {
        this.clear();
        this.well.render();
    },
}

app.start = function() {
    app.game.start();
};
