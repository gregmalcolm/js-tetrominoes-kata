define(['javascripts/control/game/well.js'], function(Well) { 
  var game = {
    init : function(view) {
      self.view = view;
      view.Game.GameView.render();
    }
  }

  var self = game;

  return { 
    Well: Well,
    init: self.init
  };
});


