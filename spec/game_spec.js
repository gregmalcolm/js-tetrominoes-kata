var app = tetrominoes;

describe("tetrominoes.Game", function() {
    describe("#gameState", function() {
        Given(function() { subject = app.Game.beget(); });
        Given(function() { subject.gameStateName = "playing" });
        When(function() { gameStates = subject.gameState() });
        Then(function() { expect(gameStates["enter"]).not.toBeUndefined() });
        Then(function() { expect(gameStates["exit"]).not.toBeUndefined() });
    });
});
