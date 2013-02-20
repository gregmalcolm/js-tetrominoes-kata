var app = tetrominoes;
app.model = app.model || {};

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


