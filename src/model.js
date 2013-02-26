var app = tetrominoes;
app.model = {};
var model = app.model;


app.model.Game = {
    canvasWidth : null,
    canvasHeight : null,
    blockWidth : null,
    blockHeight : null,
    widthInBlocks : 14,
    heightInBlocks : 17,
    well : null,
    shapes : [],
    player : [],
    blocks : [],

    init: function(view) {
        this.initMetrics(view);
        this.well = app.model.Well.beget();
        this.shapes = app.model.shapes();
        this.player = app.model.Player.beget(this);
    },

    initMetrics: function(view) {
        this.canvasWidth = view.canvas.width;
        this.canvasHeight = view.canvas.height;
        this.blockWidth = this.canvasWidth / this.widthInBlocks;
        this.blockHeight = this.canvasHeight / this.heightInBlocks;
    },

    blocks: function(x, y, colorNum) {
        if (typeof colorNum === 'undefined') {
            return this.blocks[x,y];
        } else {
            this.blocks[x,y] = colorNum;
        }
    },
};

