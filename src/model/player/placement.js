var app = tetrominoes;
app.model = app.model || {};

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

