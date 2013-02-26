var app = tetrominoes;
app.model = app.model || {};

app.model.Well = {
    widthInBlocks: 10,
    heightInBlocks: 14,

    left: function()   { return 0; },
    top: function()    { return 0; },
    right: function()  { return this.widthInBlocks - 1; },
    bottom: function() { return this.heightInBlocks - 1; },
};
