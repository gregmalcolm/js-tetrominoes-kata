var app = tetrominoes;

app.model = {
    canvasWidth: undefined,
    canvasHeight: undefined,
    blockWidth: undefined,
    blockHeight: undefined,
    widthInBlocks: 14,
    heightInBlocks: 17,

    init: function(view) {
        this.canvasWidth  = view.canvas.width;
        this.canvasHeight = view.canvas.height;
        this.blockWidth  = this.canvasWidth  / this.widthInBlocks;
        this.blockHeight = this.canvasHeight / this.heightInBlocks;
    }
};
