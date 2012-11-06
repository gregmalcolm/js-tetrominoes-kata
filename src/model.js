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
        this.well = model.well;
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

model.well = {
    widthInBlocks: 10,
    heightInBlocks: 15,
    offset: { x: 1, y: 1},
};

model.Shape = {
    positions: [],

    beget: function(args) {
        var self = Object.create(this);
        self.positions = self.calcPositions(args.blocks);

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
    }
};

model.shapes = function() {
    var self = [];

    self.push(model.Shape.beget({blocks:
        [["X",
          "O",
          "X",
          "X"],

         ["XOXX"]]})
    );

    self.push(model.Shape.beget({blocks:
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

    self.push(model.Shape.beget({blocks:
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

    self.push(model.Shape.beget({blocks:
        [["X",
          "OX",
          " X"],

         [" OX",
          "XX"]]})
    );

    self.push(model.Shape.beget({blocks:
        [[" X",
          "OX",
          "X"],

         ["XO ",
          " XX"]]})
    );

    self.push(model.Shape.beget({blocks:
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

    self.push(model.Shape.beget({blocks:
        [["XX",
          "OX"]]})
    );

    model.shapes = function() {
        return self;
    };
    return self;
};

model.Player = {
    model : null,
    x : null,
    y : 0,
    position_num : null,
    shape: null,

    beget: function(model) {
        var self = Object.create(this);

        self.model = model;
        self.x = (model.well.widthInBlocks / 2) - 1;
        self.y = 0;
        self.position_num = this.randomPositionNum();

        return self;
    },

    randomPositionNum: function() {
        return app.util.randomInt(4);
    }
};
