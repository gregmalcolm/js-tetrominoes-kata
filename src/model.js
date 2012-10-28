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

    calcPositions: function(blocks) {
        var positions = [];
        var offsetX = 0;
        var offsetY = 0;

        for(var pos = 0; pos < blocks.length; ++pos) {
            positions[pos] = { blocks: [] };
            for(var y = 0; y < blocks[pos].length; ++y) {
                block_num=0;
                for(var x = 0; x < blocks[pos][y].length; ++x) {
                    block = blocks[pos][y][x];
                    if (block !== " ") {
                        positions[pos].blocks.push( {'x' : x,
                                                     'y' : y });
                    }
                }
            }
        }

        return positions;
    },
};
