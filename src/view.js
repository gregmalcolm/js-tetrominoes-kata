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

        return that;
    },

    clear: function() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    renderBackground: function() {
        this.clear();
        this.well.render();
    },

    render: function() {
        this.renderBackground();
        this.player.render();
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
    colors: ['red', 'orange', 'yellow', '#090', 'blue', 'indigo', 'violet'],

    beget: function(view) {
        var that = Object.create(this);

        that.view = view;
		that.model = view.model;

        return that;
    },

    render: function() {
		var m = this.model;
        var player = m.player;
		var wellView = this.view.well;
        var blocks = player.wellBlocks();

        this.view.context.fillStyle = this.colors[this.model.player.colorNum];

        for (var i = 0; i < blocks.length; ++i) {
            var block = blocks[i];
            this.view.context.fillRect(wellView.left() + (m.blockWidth * block.x) + 1,
                                       wellView.top() + (m.blockHeight * block.y) + 1,
                                       m.blockWidth - 1,
                                       m.blockHeight - 1);
        };
    },
}
