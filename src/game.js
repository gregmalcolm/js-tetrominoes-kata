var app = tetrominoes;

app.Game = {
    model : null,
    view : null,

    keyCodes : {
        left: 37, up:38, right: 39, down: 40,
        w: 87, a: 65, s: 83, d: 68
    },

    keys : {
        left: false,
        up: false,
        right: false,
        down: false
    },

    run : function() {
        this.model = app.model.Game.beget();
        this.view =  app.view.Game.beget(this.model);

        this.model.init(this.view);

        this.view.renderBackground();

        this.start();
    },

    start: function() {
        var that = this;

        setInterval(function() {
            return that.updateGame();
        }, 20);

        $(document).keydown( function(e) { that.onKeyDown(e); } );
        $(document).keyup( function(e) { that.onKeyUp(e); } );
    },

    updateGame: function() {
        this.respond();
        this.view.render();
    },

    respond: function() {
        if (this.keys.left) {
            --this.model.player.x;
        } else if (this.keys.right) {
            ++this.model.player.x;
        };
    },

    onKeyDown : function(e) {
        var that = this;
        switch(e.keyCode) {
            case that.keyCodes.left:
            case that.keyCodes.a:
                that.keys.left = true;
                that.keys.right = false;
                break;

            case that.keyCodes.right:
            case that.keyCodes.d:
                that.keys.right = true;
                that.keys.left = false;
                break;
        };
    },

    onKeyUp : function(e) {
        var that = this;
        switch(e.keyCode) {
            case that.keyCodes.left:
            case that.keyCodes.a:
                that.keys.left = false;
                break;

            case that.keyCodes.right:
            case that.keyCodes.d:
                that.keys.right = false;
                break;
        };

    },

}



