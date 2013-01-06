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
};

app.model.Shape = {
    rotations: [],

    beget: function(args) {
        var that = Object.create(this);
        that.rotations = that.calcRotations(args.blocks);

        return that;
    },

    calcRotations: function(blockRotations) {
        var rotations = [];

        for(var pos = 0; pos < blockRotations.length; ++pos) {
            rotations.push(this.calcRotation(blockRotations[pos]));
        }

        return rotations;
    },

    calcRotation: function(blocks) {
        var offsets = this.findBlockOffsets(blocks);

        var rotation = { blocks: [] };
        for(var y = 0; y < blocks.length; ++y) {
            for(var x = 0; x < blocks[y].length; ++x) {
                block = blocks[y][x];
                if (!block.match(/[ .]/)) {
                    rotation.blocks.push( {'x' : x - offsets.x,
                                           'y' : y - offsets.y});
                }
            }
        }

        return rotation;
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
    rotationNum : null,
    shape: null,

    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.spawn();

        return that;
    },

    spawn: function(shape, rotationNum) {
        this.x = (this.model.well.widthInBlocks / 2) - 1;
        this.shape = shape || this.randomShape();
        this.rotationNum = (typeof rotationNum === "undefined")
                           ? this.randomRotationNum() : rotationNum;

        this.y = -(this.top());
    },

    randomShape: function() {
        var shapeNum = app.util.randomInt(app.model.shapes().length);
        return app.model.shapes()[shapeNum];
    },

    randomRotationNum: function() {
        return app.util.randomInt(this.maxRotations());
    },

    localRotationNum: function(rotationNum) {
        return rotationNum % this.maxRotations();
    },

    maxRotations: function() {
        return this.shape ? this.shape.rotations.length : 1;
    },

    localBlocks: function() {
        if (!this.shape || !this.shape.rotations[this.rotationNum]) {
            return null;
        };

        return this.shape.rotations[this.rotationNum].blocks;
    },

    wellBlocks: function() {
        var blocks = [];
        var local = this.localBlocks();
        var that = this;

        for (var i = 0; i < local.length; ++i) {
            blocks[i] = {
                            x: that.x + local[i].x,
                            y: that.y + local[i].y
                        };
        }

        return blocks;
    },

    left: function() {
        var left = 9999;
        var blocks = this.wellBlocks();
        for (var i = 0; i < blocks.length; ++i) {
          if (blocks[i].x < left) {
              left = blocks[i].x;
          }
        }
        return left;
    },

    top: function() {
        var top = 9999;
        var blocks = this.wellBlocks();
        for (var i = 0; i < blocks.length; ++i) {
          if (blocks[i].y < top) {
              top = blocks[i].y;
          }
        }
        return top;
    },

    right: function() {
        var right = -9999;
        var blocks = this.wellBlocks();
        for (var i = 0; i < blocks.length; ++i) {
          if (blocks[i].x > right) {
              right = blocks[i].x;
          }
        }
        return right;
    },

    bottom: function() {
        var bottom = -9999;
        var blocks = this.wellBlocks();
        for (var i = 0; i < blocks.length; ++i) {
          if (blocks[i].y > bottom) {
              bottom = blocks[i].y;
          }
        }
        return bottom;
    },
};
