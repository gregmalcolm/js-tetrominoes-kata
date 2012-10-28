var app = tetrominoes;

app.game = {
    start: function() {
        app.view.init();
        app.model.init(app.view);

        app.view.renderBackground();
    }
}



