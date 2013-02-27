var app = tetrominoes;
app.view = app.view || {};

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

