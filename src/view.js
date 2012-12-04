var app = tetrominoes;
app.view = {};
var view = app.view;

view.Game = {
    beget: function(model) {
        var that = Object.create(this);

        that.model = model;
        that.canvas = $('canvas#mainGame')[0]
        that.context = that.canvas.getContext('2d');

		that.well = view.Well.beget(that);
        that.player = view.Player.beget(that);

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
        this.player.render();
    },
};

view.Well = {
    beget: function(view) {
        var that = Object.create(this);
        that.view = view;

        return that;
    },

    render: function() {
        this.view.context.fillStyle = '#CCC';

		var m = this.view.model;
        var width       = m.widthInBlocks;
        var height      = m.heightInBlocks;

        this.view.context
                .fillRect(m.blockWidth,
                          m.blockHeight,
                          m.blockWidth + 1,
                          (m.blockHeight * (height - 2)) + 1);

        this.view.context
                .fillRect(m.blockWidth * 2,
                          m.blockHeight * (height - 2),
                          (m.blockWidth * (width - 4)) + 1,
                          m.blockHeight + 1);

        this.view.context
                .fillRect(m.blockWidth * (width - 2),
                          m.blockHeight,
                          m.blockWidth + 1,
                          (m.blockHeight * (height - 2)) + 1);
    }
};

view.Player = {
    beget: function(view) {
        var that = Object.create(this);

        that.view = view;
		that.model = view.model;

        return that;
    },

    render: function() {
        this.view.context.fillstyle = 'yellow';

        player = this.model.player;
		well = this.model.well;

		var m = this.model;

        this.view.context.fillRect(m.blockWidth * 6,
                                   m.blockHeight * 6,
                                   m.blockWidth + 1,
                                   m.blockHeight + 1);
    },
}
