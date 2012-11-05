var app = tetrominoes;
var view = {};

view.Well = {
    view: null,

    beget: function(view) {
        var self = Object.create(this);

        self.view = view;

        return self;
    },

    render: function() {
        this.view.context.fillStyle = '#CCC';

        var blockWidth  = this.view.model.blockWidth;
        var blockHeight = this.view.model.blockHeight;
        var width       = this.view.model.widthInBlocks;
        var height      = this.view.model.heightInBlocks;

        this.view.context
                .fillRect(blockWidth,
                          blockHeight,
                          blockWidth + 1,
                          (blockHeight * (height - 2)) + 1);

        this.view.context
                .fillRect(blockWidth * 2,
                          blockHeight * (height - 2),
                          (blockWidth * (width - 4)) + 1,
                          blockHeight + 1);

        this.view.context
                .fillRect(blockWidth * (width - 2),
                          blockHeight,
                          blockWidth + 1,
                           (blockHeight * (height - 2)) + 1);
    }
};

app.View = {
    model: null,

    canvas: null,
    context: null,

    well: null,

    beget: function(model) {
        var self = Object.create(this);

        self.model = model;
        self.canvas = $('canvas#mainGame')[0]
        self.context = self.canvas.getContext('2d');
        self.well = view.Well.beget(self);

        return self;
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


