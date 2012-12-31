var app = tetrominoes;
app.model = {};
var model = app.model;

model.Game = {
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
        this.well = model.Well.beget();
        this.shapes = model.shapes();
        this.player = model.Player.beget(this);
    },

    initMetrics: function(view) {
        this.canvasWidth = view.canvas.width;
        this.canvasHeight = view.canvas.height;
        this.blockWidth = this.canvasWidth / this.widthInBlocks;
        this.blockHeight = this.canvasHeight / this.heightInBlocks;
    },
};

model.Well = {
    widthInBlocks: 10,
    heightInBlocks: 15,
    offset: { x: 14, y: 17},
};

model.Shape = {
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

model.shapes = function() {
    var that = [];

    that.push(model.Shape.beget({blocks:
        [["X",
          "O",
          "X",
          "X"],

         ["XOXX"]]})
    );

    that.push(model.Shape.beget({blocks:
        [["X",
          "X",
          "O",
          "XX"],

         ["XOXX",
          "X"],

         ["XX",
          " O",
          " X",
          " X"],

         ["   X",
          "XXOX"]]})
    );

    that.push(model.Shape.beget({blocks:
        [[" X",
          " X",
          " O",
          "XX"],

         ["X",
          "XOXX"],

         ["XX",
          "O",
          "X",
          "X"],

         ["XXOX",
          "   X"]]})
    );

    that.push(model.Shape.beget({blocks:
        [["X",
          "OX",
          " X"],

         [" OX",
          "XX"]]})
    );

    that.push(model.Shape.beget({blocks:
        [[" X",
          "OX",
          "X"],

         ["XO ",
          " XX"]]})
    );

    that.push(model.Shape.beget({blocks:
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

    that.push(model.Shape.beget({blocks:
        [["XX",
          "OX"]]})
    );

    model.shapes = function() {
        return that;
    };
    return that;
};

model.Player = {
    model : null,
    x : null,
    y : 0,
    position_num : null,
    shape: null,

    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.x = (model.well.widthInBlocks / 2) - 1;
        that.y = 0;
        that.position_num = this.randomPositionNum();

        return that;
    },

    randomPositionNum: function() {
        return app.util.randomInt(4);
    }
};
