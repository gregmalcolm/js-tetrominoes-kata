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
    score: 0,

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
        this.shape = shape || this._randomShape();
        this.rotationNum = (typeof rotationNum === "undefined")
                           ? this._randomRotationNum() : rotationNum;

        this.y = 0;
        this.y = -(this.top());
        this.colorNum = (typeof colorNum === "undefined")
                        ? this._randomColorNum() : colorNum;
        this.level = level ? level : 1;
        this.resetFallDelay();
    },

    localRotationNum: function(rotationNum) {
        return rotationNum % this._maxRotations();
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
        this._handleRotation(function(player) {
            player.placement._rotationNum = (player.rotationNum + 1) %
                                            player._maxRotations();
        });
    },

    slideLeft: function() {
        this._handleHSlide(function(player) {
            player.placement._x = player.x - 1;
        });
    },

    slideRight: function() {
        this._handleHSlide(function(player) {
            player.placement._x = player.x + 1;
        });
    },

    slideDown: function() {
        if (!this.canVSlide()) { return false };
        this.placement._y = this.y + 1;
        this.resetVSlideDelay();
        this.lastFallTime = this.lastVSlideTime;
        return this.placement.commitOrLand();
    },

    applyGravity: function() {
        if (!this.canFall()) { return false };
        this.placement._y = this.y + 1;
        this.resetFallDelay();
        return this.placement.commitOrLand();
    },

    gameTime: function() {
        return new Date().getTime();
    },

    elapsedTime: function(oldTime) {
        return this.gameTime() - oldTime;
    },

    canHSlide: function() {
        return this.elapsedTime(this.lastHSlideTime) > 100;
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

    cancelHSlideDelay: function() {
        return this.lastHSlideTime = 0;
    },

    cancelVSlideDelay: function() {
        return this.lastVSlideTime = 0;
    },

    cancelRotateDelay: function() {
        return this.lastRotateTime = 0;
    },

    resetHSlideDelay: function() {
        this.lastHSlideTime = this.gameTime();
    },

    resetVSlideDelay: function() {
        this.lastVSlideTime = this.gameTime();
    },

    resetFallDelay: function() {
        this.lastFallTime = this.gameTime();
    },

    resetRotateDelay: function() {
        this.lastRotateTime = this.gameTime();
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

        app.game.changeGameState("countLines");
        this.spawn();
        return this;
    },

    scoringForCompleteLines: function() {
        for (var y = 0 ; y < this.model.well.heightInBlocks; ++y) {
            var fullLine = true;
            for (var x = 0 ; x < this.model.well.widthInBlocks; ++x) {
                if (typeof this.model.block(x, y) === 'undefined') {
                    fullLine = false;
                }
            }
        }
        return {lines:[12]};
    },

    _randomShape: function() {
        var shapeNum = app.util.randomInt(app.model.shapes().length);
        return app.model.shapes()[shapeNum];
    },

    _randomRotationNum: function() {
        return app.util.randomInt(this._maxRotations());
    },

    _randomColorNum: function() {
        return app.util.randomInt(app.view.Blocks.colors.length);
    },

    _maxRotations: function() {
        return this.shape ? this.shape.rotations.length : 1;
    },

    _handleHSlide: function(action) {
        if (!this.canHSlide()) { return false };
        action(this);
        this.resetHSlideDelay();
        return this.placement.commit();
    },

    _handleRotation: function(action) {
        if (!this.canRotate()) { return false };
        action(this);
        this.resetRotateDelay();
        this.lastRotateTime = this.gameTime();
        return this.placement.commit();
    },


};
