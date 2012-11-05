var app = tetrominoes;

app.Game = {
    model : null,
    view : null,

    run : function() {
        this.model = app.Model.beget();
        this.view =  app.View.beget(this.model);

        this.model.init(this.view);

        this.view.renderBackground();
    }
}



