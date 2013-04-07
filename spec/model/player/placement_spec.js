var app = tetrominoes;

describe("tetrominoes.model.Placement", function() {
    var subject, player, view, gameModel;
    var shape, rotationNum, color;
    var x, y;

    Given(function() { view = { canvas: { width: 504, height: 612} }});
    Given(function() { gameModel = app.model.Game.beget(); });
    Given(function() { gameModel.init(view); });
    Given(function() { shape = app.model.shapes()[3]; });
    Given(function() { rotationNum = 0; });
    Given(function() { colorNum = 0; });
    Given(function() { level = 2; });
    Given(function() { player = app.model.Player.beget(gameModel); });
    Given(function() { player.spawn(shape, rotationNum, 3, 1); });
    Given(function() { subject = player.placement; });
    Given(function() { app.game.changeGameState = function(){}; });

    context("with X placement", function() {
        Given(function() { subject._x = 7; });
        When(function() { x = subject.x(); });
        Then(function() { expect(x).toBe(7); });
    });
    context("without X placement", function() {
        When(function() { x = subject.x(); });
        Then(function() { expect(x).toBe(4); });
    });
    context("with Y placement", function() {
        Given(function() { subject._y = 10; });
        When(function() { y = subject.y(); });
        Then(function() { expect(y).toBe(10); });
    });
    context("without Y placement", function() {
        When(function() { y = subject.y(); });
        Then(function() { expect(y).toBe(1); });
    });
    context("with Rotation placement", function() {
        Given(function() { subject._rotationNum = 2; });
        When(function() { rotationNum = subject.rotationNum(); });
        Then(function() { expect(rotationNum).toBe(2); });
    });
    context("without Rotation placement", function() {
        When(function() { rotationNum = subject.rotationNum(); });
        Then(function() { expect(rotationNum).toBe(0); });
    });

    describe("#wellBlocks", function() {
        var blocks;

        When(function() { blocks = subject.wellBlocks(); });

        Then(function() { expect(blocks[1].x).toBe(4); });
        Then(function() { expect(blocks[1].y).toBe(1); });

        Then(function() { expect(blocks[3].x).toBe(5); });
        Then(function() { expect(blocks[3].y).toBe(2); });
    });

    describe("#isValid", function() {
        var valid;

        context("left as far as allowed", function() {
            Given(function() { subject._x = 0; });
            When(function() { valid = subject.isValid(); });
            Then(function() { expect(valid).toBeTruthy(); });
        });
        context("too far left", function() {
            Given(function() { subject._x = -1; });
            When(function() { valid = subject.isValid(); });
            Then(function() { expect(valid).toBeFalsy(); });
        });
        context("right as far as allowed", function() {
            Given(function() { subject._x = 8; });
            When(function() { valid = subject.isValid(); });
            Then(function() { expect(valid).toBeTruthy(); });
        });
        context("too far right", function() {
            Given(function() { subject._x = 9; });
            When(function() { valid = subject.isValid(); });
            Then(function() { expect(valid).toBeFalsy(); });
        });
        context("another shape block is in the way", function() {
            Given(function() { player.y = 12; });
            Given(function() { player.landShape(); });
            Given(function() { subject._y = 11; });
            When(function() { valid = subject.isValid(); });
            Then(function() { expect(valid).toBeFalsy(); });
        });
    });

    describe("#commit", function() {
        var result;

        context("when placement is legal", function() {
            context("and everything is supposed to change", function() {
                Given(function() { subject._x = 6; });
                Given(function() { subject._y = 2; });
                Given(function() { subject._rotationNum = 1; });

                When(function() { result = subject.commit(); });
                Then(function() { expect(result).toBeTruthy(); });

                Then(function() { expect(player.x).toBe(6); });
                Then(function() { expect(player.y).toBe(2); });
                Then(function() { expect(player.rotationNum).toBe(1); });

                Then(function() { expect(subject._x).toBeNull(); });
                Then(function() { expect(subject._y).toBeNull(); });
                Then(function() { expect(subject._rotationNum).toBeNull(); });
            });
            context("and only one thing changes", function() {
                Given(function() { subject._x = 3; });

                When(function() { result = subject.commit(); });
                Then(function() { expect(result).toBeTruthy(); });
                Then(function() { expect(player.x).toBe(3); });
                Then(function() { expect(player.y).toBe(1); });
                Then(function() { expect(player.rotationNum).toBe(0); });
            });
        });

        context("#commitOrLand", function() {
            var result;
            context("when the next move is legal", function() {
                Given(function() { player.y = 6; });
                Given(function() { subject._y = 7; });
                When(function() { result = subject.commitOrLand(); });
                Then(function() { expect(result).toBeTruthy(); });
                Then(function() { expect(player.y).toBe(7); });
            });
            context("when the next move is legal", function() {
                Given(function() { player.y = 12; });
                Given(function() { subject._y = 13; });
                When(function() { result = subject.commitOrLand(); });
                Then(function() { expect(result).toBeFalsy(); });
            });
        });

        context("when sliding into an illegal position horizontally", function() {
            Given(function() { subject._x = 10; });

            When(function() { result = subject.commit(); });
            Then(function() { expect(result).toBeFalsy(); });
            Then(function() { expect(player.x).toBe(4); });
        });

        context("when sliding into an illegal position vertically", function() {
            Given(function() { subject._y = 13; });

            When(function() { result = subject.commit(); });
            Then(function() { expect(result).toBeFalsy(); });
            Then(function() { expect(player.y).toBe(1); });
        });

        context("when rotating into an illegal position", function() {
            Given(function() { subject._x = 0; });
            Given(function() { subject._rotationNum = 1; });

            When(function() { result = subject.commit(); });
            Then(function() { expect(result).toBeFalsy(); });
            Then(function() { expect(player.rotationNum).toBe(0); });
        });
    });
});
