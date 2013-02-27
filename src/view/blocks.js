var app = tetrominoes;
app.view = app.view || {};

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

