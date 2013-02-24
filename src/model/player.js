var app = tetrominoes;
app.model = app.model || {};

app.model.Player = {
    model : null,
    x : null,
    y : null,
    rotationNum : null,
    shape: null,
    lastSlideTime: 0,
    lastRotateTime: 0,
    placement: null,

    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.spawn();

        that.placement = app.model.Placement.beget(model, that);

        return that;
    },

    spawn: function(shape, rotationNum) {
        this.x = (this.model.well.widthInBlocks / 2) - 1;
        this.shape = shape || this.randomShape();
        this.rotationNum = (typeof rotationNum === "undefined")
                           ? this.randomRotationNum() : rotationNum;

        this.y = 0;
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

        for (var i = 0; i < local.length; ++i) {
            blocks[i] = {
                            x: this.x + local[i].x,
                            y: this.y + local[i].y
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

    rotate: function() {
        this.handleRotation(function(player) {
            player.rotationNum = (player.rotationNum + 1) % player.maxRotations();
        });
    },

    slideLeft: function() {
        this.handleSlide(function(player) { --player.x; });
    },

    slideRight: function() {
        this.handleSlide(function(player) { ++player.x; });
    },

    handleSlide: function(action) {
        if (!this.canSlide()) { return false };
        action(this);
        this.lastSlideTime = this.gameTime();
        return true;
    },

    handleRotation: function(action) {
        if (!this.canRotate()) { return false };
        action(this);
        this.lastRotateTime = this.gameTime();
        return true;
    },

    gameTime: function() {
        return new Date().getTime();
    },

    elapsedTime: function(oldTime) {
        return this.gameTime() - oldTime;
    },

    canSlide: function() {
        return this.elapsedTime(this.lastSlideTime) > 80;
    },

    canRotate: function() {
        return this.elapsedTime(this.lastRotateTime) > 160;
    },

    resetSlideDelay: function() {
        return this.lastSlideTime = 0;
    },

    resetRotateDelay: function() {
        return this.lastRotateTime = 0;
    },
};

app.model.Placement = {
    model: null,
    player: null,
    _x: null,
    _y: null,
    _rotationNum: null,

    beget: function(model, player) {
        var that = Object.create(this);
        that.model = model;
        that.player = player;
        return that;
    },

    x: function() {
        return this._x ? this._x : this.player.x;
    },

    y: function() {
        return this._y ? this._y : this.player.y;
    },

    rotationNum: function() {
        return this._rotationNum ? this._rotationNum : this.player.rotationNum;
    },

    wellBlocks: function() {
        var blocks = [];
        var local = this.player.localBlocks();

        for (var i = 0; i < local.length; ++i) {
            blocks[i] = {
                            x: this.x() + local[i].x,
                            y: this.y() + local[i].y
                        };
        }

        return blocks;
    },

    isValid : function() {
        var blocks;
        blocks = this.wellBlocks();
        if (this.outsideWell(blocks)) { return false; }
        return true;
    },

    outsideWell : function(blocks) {
        for (var i = 0; i < blocks.length; ++i) {
            var block = blocks[i];
            if (block.x < this.model.well.left()) { return true; }
        }
        return false;
    },
};

