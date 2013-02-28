var app = tetrominoes;

app.Game = {
    model : null,
    view : null,
    gameStateName : null,

    keyCodes : {
        left: 37, up:38, right: 39, down: 40,
        w: 87, a: 65, s: 83, d: 68,
        h: 72, j: 74, k: 75, l: 76,
    },

    keys : {
        left: false,
        up: false,
        right: false,
        down: false
    },

    beget : function() {
        var that = Object.create(this);

        that.model = app.model.Game.beget();
        that.view =  app.view.Game.beget(that.model);

        that.model.init(that.view);

        return that;
    },

    run : function() {
        this.view.renderBackground();
        this.start();
    },

    start: function() {
        var that = this;
        that.gameStateName = "playing";

        setInterval(function() {
            return that.updateGame();
        }, 20);

        $(document).keydown( function(e) { that.onKeyDown(e); } );
        $(document).keyup( function(e) { that.onKeyUp(e); } );
    },

    updateGame: function() {
        this.physics();
        this.respond();
        this.view.render();
    },

    physics: function() {
        this.model.player.applyGravity();
    },

    respond: function() {
        if (this.keys.left) {
            this.model.player.slideLeft();
        } else if (this.keys.right) {
            this.model.player.slideRight();
        } else {
            this.model.player.cancelHSlideDelay();
        };

        if (this.keys.down) {
            this.model.player.slideDown();
        } else {
            this.model.player.cancelVSlideDelay();
        };

        if (this.keys.up) {
            this.model.player.rotate();
        } else {
            this.model.player.cancelRotateDelay();
        };
    },

    onKeyDown : function(e) {
        var that = this;
        switch(e.keyCode) {
            case that.keyCodes.left:
            case that.keyCodes.a:
            case that.keyCodes.h:
                that.keys.left = true;
                that.keys.right = false;
                break;

            case that.keyCodes.right:
            case that.keyCodes.d:
            case that.keyCodes.l:
                that.keys.right = true;
                that.keys.left = false;
                break;

            case that.keyCodes.up:
            case that.keyCodes.w:
            case that.keyCodes.k:
                that.keys.up = true;
                break;

            case that.keyCodes.down:
            case that.keyCodes.s:
            case that.keyCodes.j:
                that.keys.down = true;
                break;
        };
    },

    onKeyUp : function(e) {
        var that = this;
        switch(e.keyCode) {
            case that.keyCodes.left:
            case that.keyCodes.a:
            case that.keyCodes.h:
                that.keys.left = false;
                break;

            case that.keyCodes.right:
            case that.keyCodes.d:
            case that.keyCodes.l:
                that.keys.right = false;
                break;

            case that.keyCodes.up:
            case that.keyCodes.w:
            case that.keyCodes.k:
                that.keys.up = false;
                break;

            case that.keyCodes.down:
            case that.keyCodes.s:
            case that.keyCodes.j:
                that.keys.down = false;
                break;
        };
    },

}



