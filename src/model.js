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
        this._initMetrics(view);
        this.well = app.model.Well.beget();
        this.shapes = app.model.shapes();
        this.player = app.model.Player.beget(this);
    },

    block: function(x, y, colorNum) {
        if (typeof colorNum === 'undefined') {
            return this._getBlock(x, y);
        } else {
            this._setOrUnassignBlock(x, y, colorNum);
            return this;
        }
    },

    _initMetrics: function(view) {
        this.canvasWidth = view.canvas.width;
        this.canvasHeight = view.canvas.height;
        this.blockWidth = this.canvasWidth / this.widthInBlocks;
        this.blockHeight = this.canvasHeight / this.heightInBlocks;
    },

    _setOrUnassignBlock: function(x, y, colorNum) {
        if (colorNum === null) {
            this._unassignBlock(x, y);
        } else {
            this._setBlock(x, y, colorNum);
        }
    },

    _unassignBlock: function(x, y, colorNum) {
        this.blocks[x,y] = undefined;
    },

    _setBlock: function(x, y, colorNum) {
        this.blocks[x,y] = colorNum;
    },

    _getBlock: function(x,y) {
        return this.blocks[x,y];
    },
};

