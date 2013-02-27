var app = tetrominoes;
app.view = {};

app.view.Game = {
    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.canvas = $('canvas#mainGame')[0]
        that.context = that.canvas.getContext('2d');

		that.well = app.view.Well.beget(that);
        that.player = app.view.Player.beget(that);
        that.blocks = app.view.Blocks.beget(that);

        return that;
    },

    render: function() {
        this.renderBackground();
        this.blocks.render();
        this.player.render();
    },

    clear: function() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    renderBackground: function() {
        this.clear();
        this.well.render();
    },
};

app.view.Well = {
    beget: function(view) {
        var that = Object.create(this);
        that.view = view;

        return that;
    },

    margin: function() {
        var margin = {};
        margin.width = this.view.model.blockWidth;
        margin.height = this.view.model.blockHeight;

        return margin;
    },

    padding: function() {
        var padding = {};
        padding.width = 2;
        padding.height = 2;

        return padding;
    },

    wall: function() {
        var wall = {};
        wall.width = this.view.model.blockWidth - this.padding().width;
        wall.height = this.view.model.blockHeight - this.padding().height;
        wall.left = this.margin().width;
        wall.top = this.margin().height;
        wall.right = this.view.canvas.width - wall.left;
        wall.bottom = this.view.canvas.height - wall.top;

        return wall;
    },

    left: function() {
        return this.margin().width + this.wall().width + this.padding().width;
    },

    top: function() {
        return this.margin().height;
    },

    right : function() {
        return this.view.canvas.width - this.left();
    },

    bottom : function() {
        return this.view.canvas.height - this.top();
    },

    width : function() {
        return this.right() - this.left();
    },

    height : function() {
        return this.bottom - this.left();
    },

    render: function() {
        this.view.context.fillStyle = '#CCC';

		var m = this.view.model;
        var width       = m.widthInBlocks;
        var height      = m.heightInBlocks;

        this.view.context
                .fillRect(this.wall().left,
                          this.wall().top,
                          this.wall().width + 1,
                          (this.wall().bottom - this.wall().top) + 1);

        this.view.context
                .fillRect(this.wall().left,
                          this.wall().bottom - this.wall().height,
                          (this.wall().right - this.wall().left) + 1,
                          this.wall().height + 1);

        this.view.context
                .fillRect(this.wall().right - this.wall().width,
                          this.wall().top,
                          this.wall().width + 1,
                          (this.wall().bottom - this.wall().top) + 1);
    }
};

app.view.Player = {
    beget: function(view) {
        var that = Object.create(this);

        that.view = view;
		that.model = view.model;

        return that;
    },

    render: function() {
        var player = this.model.player;
        var blocks = player.wellBlocks();

        for (var i = 0; i < blocks.length; ++i) {
            var block = blocks[i];
            this.view.blocks.renderBlock(block.x, block.y, player.colorNum);
        };
    },
};

app.view.Blocks = {
    colors: ['#ff0000',  // red
             '#ffa500',  // orange
             '#ffff00',  // yellow
             '#009900',  // green
             '#0000ff',  // blue
             '#4b0082',  // indigo
             '#ee82ee'], // violet

    beget: function(view) {
        var that = Object.create(this);

        that.view = view;
		that.model = view.model;

        return that;
    },


    render: function() {
        for(var x = 0; x < this.model.well.widthInBlocks; ++x) {
            for(var y = 0; y < this.model.well.heightInBlocks; ++y) {
                var colorNum = this.model.block(x,y);
                if (typeof colorNum !== "undefined") {
                    this.renderBlock(x, y, colorNum);
                }
            }
        }
    },

    renderDarkBlock: function(x, y, colorNum) {
        this.renderBlock(x, y, colorNum, function(obj, colorNum) {
            return obj._shadeColor(obj.colors[colorNum], 100);
        });
    },

    renderBlock: function(x, y, colorNum, colorMutator) {
        var that = this;
		var m = this.model;
		var wellView = this.view.well;
        if (typeof colorMutator === "undefined") {
            colorMutator = function(obj, colorNum) { return obj.colors[colorNum] };
        }
        this.view.context.fillStyle = colorMutator(this, colorNum);
        this.view.context.fillRect(wellView.left() + (m.blockWidth * x) + 1,
                                   wellView.top() + (m.blockHeight * y) + 1,
                                   m.blockWidth - 1,
                                   m.blockHeight - 1);
    },

    _shadeColor: function(color, porcent) {
        // Borrowed from:
        // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color

        var r = parseInt(color.substring(1,3),16)
        var g = parseInt(color.substring(3,5),16)
        var b = parseInt(color.substring(5,7),16);

        r = parseInt(r * (100 + porcent) / 100);
        g = parseInt(g * (100 + porcent) / 100);
        b = parseInt(b * (100 + porcent) / 100);

        r = (r<255)?r:255;
        g = (g<255)?g:255;
        b = (b<255)?b:255;

        var rr = ((r.toString(16).length==1)?"0"+r.toString(16):r.toString(16));
        var gg = ((g.toString(16).length==1)?"0"+g.toString(16):g.toString(16));
        var bb = ((b.toString(16).length==1)?"0"+b.toString(16):b.toString(16));

        return "#"+rr+gg+bb;
    },
};
