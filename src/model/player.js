var app = tetrominoes;
app.model = app.model || {};

app.model.Player = {
    model : null,
    x : null,
    y : null,
    rotationNum : null,
    shape: null,
    colorNum: null,
    lastHSlideTime: 0,
    lastVSlideTime: 0,
    lastRotateTime: 0,
    placement: null,

    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.spawn();

        that.placement = app.model.Placement.beget(model, that);

        return that;
    },

    spawn: function(shape, rotationNum, colorNum) {
        this.x = (this.model.well.widthInBlocks / 2) - 1;
        this.shape = shape || this.randomShape();
        this.rotationNum = (typeof rotationNum === "undefined")
                           ? this.randomRotationNum() : rotationNum;

        this.y = 0;
        this.y = -(this.top());
        this.colorNum = (typeof colorNum === "undefined")
                        ? this.randomColorNum() : colorNum;
    },

    randomShape: function() {
        var shapeNum = app.util.randomInt(app.model.shapes().length);
        return app.model.shapes()[shapeNum];
    },

    randomRotationNum: function() {
        return app.util.randomInt(this.maxRotations());
    },

    randomColorNum: function() {
        return app.util.randomInt(app.view.Player.colors.length);
    },

    localRotationNum: function(rotationNum) {
        return rotationNum % this.maxRotations();
    },

    maxRotations: function() {
        return this.shape ? this.shape.rotations.length : 1;
    },

    localBlocks: function(rotationNum) {
        if (typeof rotationNum !== "number") { rotationNum = this.rotationNum };
        if (!this.shape || !this.shape.rotations[rotationNum]) {
            return null;
        };

        return this.shape.rotations[rotationNum].blocks;
    },

    wellBlocks: function() {
        return this.projectBlocks(this.x, this.y, this.rotationNum);
    },

    projectBlocks: function(x, y, rotationNum) {
        var blocks = [];
        var local = this.localBlocks(rotationNum);

        for (var i = 0; i < local.length; ++i) {
            blocks[i] = {
                            x: x + local[i].x,
                            y: y + local[i].y
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
            player.placement._rotationNum = (player.rotationNum + 1) %
                                            player.maxRotations();
        });
    },

    slideLeft: function() {
        this.handleHSlide(function(player) {
            player.placement._x = player.x - 1;
        });
    },

    slideRight: function() {
        this.handleHSlide(function(player) {
            player.placement._x = player.x + 1;
        });
    },

    slideDown: function() {
        this.handleVSlide(function(player) {
            player.placement._y = player.y + 1;
        });
    },

    handleHSlide: function(action) {
        if (!this.canHSlide()) { return false };
        action(this);
        this.lastHSlideTime = this.gameTime();
        return this.placement.commit();
    },

    handleVSlide: function(action) {
        if (!this.canVSlide()) { return false };
        action(this);
        this.lastVSlideTime = this.gameTime();
        return this.placement.commit();
    },

    handleRotation: function(action) {
        if (!this.canRotate()) { return false };
        action(this);
        this.lastRotateTime = this.gameTime();
        return this.placement.commit();
    },

    gameTime: function() {
        return new Date().getTime();
    },

    elapsedTime: function(oldTime) {
        return this.gameTime() - oldTime;
    },

    canHSlide: function() {
        return this.elapsedTime(this.lastHSlideTime) > 80;
    },

    canVSlide: function() {
        return this.elapsedTime(this.lastVSlideTime) > 40;
    },

    canRotate: function() {
        return this.elapsedTime(this.lastRotateTime) > 160;
    },

    resetHSlideDelay: function() {
        return this.lastHSlideTime = 0;
    },

    resetVSlideDelay: function() {
        return this.lastVSlideTime = 0;
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

    reset: function() {
        this._x = this._y = this._rotationNum = null;
    },

    x: function() {
        return this._x !== null ? this._x : this.player.x;
    },

    y: function() {
        return this._y !== null ? this._y : this.player.y;
    },

    rotationNum: function() {
        return this._rotationNum !== null ? this._rotationNum : this.player.rotationNum;
    },

    wellBlocks: function() {
        return this.player.projectBlocks(this.x(), this.y(), this.rotationNum());
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
            if (block.x > this.model.well.right()) { return true; }
            if (block.y > this.model.well.bottom()) { return true; }
        }
        return false;
    },

    commit : function() {
        var ok = false;
        if (this.isValid()) {
            this.player.x = this.x();
            this.player.y = this.y();
            this.player.rotationNum = this.rotationNum();
            ok = true;
        }
        this.reset();
        return ok;
    },
};

