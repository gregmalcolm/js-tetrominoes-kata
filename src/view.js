var app = tetrominoes;
var view = {};

view.well = {
    render: function() {
        app.view.context.fillStyle = '#CCC';

        var blockWidth  = app.view.model.blockWidth;
        var blockHeight = app.view.model.blockHeight;
        var width       = app.view.model.widthInBlocks;
        var height      = app.view.model.heightInBlocks;

        app.view.context
                .fillRect(blockWidth,
                          blockHeight,
                          blockWidth + 1,
                          (blockHeight * (height - 2)) + 1);

        app.view.context
                .fillRect(blockWidth * 2,
                          blockHeight * (height - 2),
                          (blockWidth * (width - 4)) + 1,
                          blockHeight + 1);

        app.view.context
                .fillRect(blockWidth * (width - 2),
                          blockHeight,
                          blockWidth + 1,
                           (blockHeight * (height - 2)) + 1);
    }
};

app.view = {
    model: undefined,

    canvas: undefined,
    context: undefined,

    well: view.well,

    init: function(model) {
        this.model = model;
        this.canvas = $('canvas#mainGame')[0]
        this.context = this.canvas.getContext('2d');
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


