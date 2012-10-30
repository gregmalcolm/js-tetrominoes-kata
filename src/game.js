var app = tetrominoes;

app.game = {
    model : undefined,

    run : function() {
        this.model = app.Model.beget();
        app.view.init(this.model);

        this.model.init(app.view);

        app.view.renderBackground();
    }
}



