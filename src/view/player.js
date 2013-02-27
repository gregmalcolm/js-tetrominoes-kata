var app = tetrominoes;
app.view = app.view || {};

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
