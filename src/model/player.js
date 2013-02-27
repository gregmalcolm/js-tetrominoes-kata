var app = tetrominoes;
app.model = app.model || {};

app.model.Player = {
    model : null,
    x : null,
    y : null,
    rotationNum : null,
    shape: null,
    colorNum: null,
    level: null,

    lastHSlideTime: 0,
    lastVSlideTime: 0,
    lastRotateTime: 0,
    lastFallTime: 0,
    placement: null,

    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.spawn();

        that.placement = app.model.Placement.beget(model, that);

        return that;
    },

    spawn: function(shape, rotationNum, colorNum, level) {
        this.x = (this.model.well.widthInBlocks / 2) - 1;
        this.shape = shape || this.randomShape();
        this.rotationNum = (typeof rotationNum === "undefined")
                           ? this.randomRotationNum() : rotationNum;

        this.y = 0;
        this.y = -(this.top());
        this.colorNum = (typeof colorNum === "undefined")
                        ? this.randomColorNum() : colorNum;
        this.level = level ? level : 1;
    },

    randomShape: function() {
        var shapeNum = app.util.randomInt(app.model.shapes().length);
        return app.model.shapes()[shapeNum];
    },

    randomRotationNum: function() {
        return app.util.randomInt(this.maxRotations());
    },

    randomColorNum: function() {
        return app.util.randomInt(app.view.Blocks.colors.length);
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
        if (!this.canVSlide()) { return false };
        this.placement._y = this.y + 1;
        this.lastVSlideTime = this.gameTime();
        this.lastFallTime = this.lastVSlideTime;
        return this.placement.commitOrLand();
    },

    applyGravity: function() {
        if (!this.canFall()) { return false };
        this.placement._y = this.y + 1;
        this.lastFallTime = this.gameTime();
        return this.placement.commitOrLand();
    },

    handleHSlide: function(action) {
        if (!this.canHSlide()) { return false };
        action(this);
        this.lastHSlideTime = this.gameTime();
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

    canFall: function() {
        return this.elapsedTime(this.lastFallTime) > this.speed();
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

    speed: function() {
        var speed = 500;
        for (var i = 1; i < this.level; i++) {
            speed = speed * 0.9;
        };

        return Math.ceil(speed);
    },

    landShape: function() {
        var blocks = this.wellBlocks();
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            this.model.block(block.x, block.y, this.colorNum);
        };

        this.spawn();
        return this;
    },
};
