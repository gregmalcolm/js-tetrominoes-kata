var app = tetrominoes;
var model = {};

app.model = {
    canvasWidth : undefined,
    canvasHeight : undefined,
    blockWidth : undefined,
    blockHeight : undefined,
    widthInBlocks : 14,
    heightInBlocks : 17,
    shapes : [],

    init: function(view) {
        this.initMetrics(view);
        this.shapes = this.buildShapes();
    },

    initMetrics: function(view) {
        this.canvasWidth = view.canvas.width;
        this.canvasHeight = view.canvas.height;
        this.blockWidth = this.canvasWidth / this.widthInBlocks;
        this.blockHeight = this.canvasHeight / this.heightInBlocks;
    },

    buildShapes: function() {
        var self = [];

        self.push(model.Shape.spawn({blocks:
            [["X",
              "O",
              "X",
              "X"],

             ["XOXX"]]})
        );

        self.push(model.Shape.spawn({blocks:
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

        self.push(model.Shape.spawn({blocks:
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

        self.push(model.Shape.spawn({blocks:
            [["X",
              "OX",
              " X"],

             [" OX",
              "XX"]]})
        );

        self.push(model.Shape.spawn({blocks:
            [[" X",
              "OX",
              "X"],

             ["XO ",
              " XX"]]})
        );

        self.push(model.Shape.spawn({blocks:
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

        self.push(model.Shape.spawn({blocks:
            [["XX",
              "OX"]]})
        );

        return self;
    },

};

model.Shape = {
    positions: [],

    spawn: function(args) {
        var self = Object.create(model.Shape);

        self.positions = this.calcPositions(args.blocks)

        return self;
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
    },
};
