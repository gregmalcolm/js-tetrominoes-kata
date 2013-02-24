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
};

app.model.Well = {
    widthInBlocks: 10,
    heightInBlocks: 15,

    left: function()   { return 0; },
    top: function()    { return 0; },
    right: function()  { return this.widthInBlocks - 1; },
    bottom: function() { return this.heightInBlocks - 1; },
};

