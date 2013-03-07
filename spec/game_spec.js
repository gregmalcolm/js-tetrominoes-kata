var app = tetrominoes;

describe("tetrominoes.Game", function() {
    Given(function() { subject = app.Game.beget(); });

    describe("#gameState", function() {
        Given(function() { subject.gameStateName = "countLines"; });
        When(function() { gameState = subject.gameState(); });
        Then(function() { expect(gameState["enter"]).not.toBeUndefined(); });
        Then(function() { expect(gameState["exit"]).not.toBeUndefined(); });
    });

    describe("#changeGameState", function() {
        var playingState, countLinesState;
        var spyOnPlayingState = function() {
            playingState = subject.gameStates["playing"];
            spyOn(playingState, "exit").andReturn();
        };
        var spyOnCountLinesState = function() {
            countLinesState = subject.gameStates["countLines"];
            spyOn(countLinesState, "enter").andReturn();
        };

        Given(function() { spyOnCountLinesState() });
        Given(function() { spyOnPlayingState() });
        Given(function() { subject.gameStateName = "playing"; });

        When(function() { gameState = subject.changeGameState("countLines"); });

        Then(function() { expect(subject.gameStateName).toBe("countLines"); });
        Then(function() { expect(playingState.exit).toHaveBeenCalled() });
        Then(function() { expect(countLinesState.enter).toHaveBeenCalled() });
    });
});
