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
    offset: { x: 14, y: 17},
};

app.model.Shape = {
    positions: [],

    beget: function(args) {
        var that = Object.create(this);
        that.positions = that.calcPositions(args.blocks);

        return that;
    },

    calcPositions: function(blockPositions) {
        var positions = [];

        for(var pos = 0; pos < blockPositions.length; ++pos) {
            positions.push(this.calcPosition(blockPositions[pos]));
        }

        return positions;
    },

    calcPosition: function(blocks) {
        var offsets = this.findBlockOffsets(blocks);

        var position = { blocks: [] };
        for(var y = 0; y < blocks.length; ++y) {
            for(var x = 0; x < blocks[y].length; ++x) {
                block = blocks[y][x];
                if (!block.match(/[ .]/)) {
                    position.blocks.push( {'x' : x - offsets.x,
                                           'y' : y - offsets.y});
                }
            }
        }

        return position;
    },

    findBlockOffsets: function(blocks) {
        for(var y = 0; y < blocks.length; ++y) {
            for(var x = 0; x < blocks[y].length; ++x) {
                if(blocks[y][x].match(/[O.]/)) {
                    return {'x' : x, 'y' : y};
                }
            }
        }

        return {'x' : 0, 'y' : 0};
    }
};

app.model.shapes = function() {
    var that = [];

    that.push(app.model.Shape.beget({blocks:
        [["X",
          "O",
          "X",
          "X"],

         ["XOXX"]]})
    );

    that.push(app.model.Shape.beget({blocks:
        [["X",
          "O",
          "XX"],

         ["XOX",
          "X"],

         ["XX",
          " O",
          " X"],

         ["  X",
          "XOX"]]})
    );

    that.push(app.model.Shape.beget({blocks:
        [[" X",
          " O",
          "XX"],

         ["X",
          "XOX"],

         ["XX",
          "O",
          "X"],

         ["XOX",
          "  X"]]})
    );

    that.push(app.model.Shape.beget({blocks:
        [["X",
          "OX",
          " X"],

         [" OX",
          "XX"]]})
    );

    that.push(app.model.Shape.beget({blocks:
        [[" X",
          "OX",
          "X"],

         ["XO ",
          " XX"]]})
    );

    that.push(app.model.Shape.beget({blocks:
        [[" X",
          "XO",
          " X"],

         [" X ",
          "XOX"],

         ["X",
          "OX",
          "X"],

         ["XOX",
          " X"]]})
    );

    that.push(app.model.Shape.beget({blocks:
        [["XX",
          "OX"]]})
    );

    app.model.shapes = function() {
        return that;
    };

    return that;
};

app.model.Player = {
    model : null,
    x : null,
    y : 0,
    positionNum : null,
    shape: null,

    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.spawn();

        return that;
    },

    spawn: function(shape, positionNum) {
        this.x = (this.model.well.widthInBlocks / 2) - 1;
        this.y = 0;
        this.shape = shape || this.randomShape();
        this.positionNum = (typeof positionNum === "undefined")
                           ? this.randomPositionNum() : positionNum;
    },

    randomShape: function() {
        var shapeNum = app.util.randomInt(app.model.shapes().length);
        return app.model.shapes()[shapeNum];
    },

    randomPositionNum: function() {
        return app.util.randomInt(this.maxPositions());
    },

    localPositionNum: function(positionNum) {
        return positionNum % this.maxPositions();
    },

    maxPositions: function() {
        return this.shape ? this.shape.positions.length : 1;
    },

    localBlocks: function() {
        if (!this.shape || !this.shape.positions[this.positionNum]) {
            return null;
        };

        return this.shape.positions[this.positionNum].blocks;
    },
};
