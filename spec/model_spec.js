var app = tetrominoes;

describe("tetrominoes.model", function() {
    var subject;
    var view;
    Given(function() {
        view = { canvas: { width: 504, height: 612} }
    });

    describe("Game", function() {
        Given(function() { game = app.Game.beget(); });
        Given(function() { subject = app.model.Game.beget(game); });
        describe(".init", function() {

            describe("metrics", function() {
                When(function() { subject.init(view); });
                Then(function() { return subject.canvasWidth  === 504; });
                Then(function() { return subject.canvasHeight === 612; });
                Then(function() { return subject.blockWidth === 36; });
                Then(function() { return subject.blockHeight === 36; });
            });

            describe("shapes", function() {
                var shape;
                When(function() { subject.init(view); });
                Then(function() { return subject.shapes.length === 7 });

                describe("#1", function() {
                    Given(function() { shape = subject.shapes[0] });
                    Then(function() { return shape.rotations[1].blocks[3].x === 2; } );
                    Then(function() { return shape.rotations[1].blocks[3].y === 0; } );
                });
            });
        });
    });

    describe("#resetBlocks", function() {
        When(function() { subject.resetBlocks(); });
        Then(function() { expect(subject.blocks.length).toBe(10); });
        Then(function() { expect(subject.blocks[0].length).toBe(14); });
        Then(function() { expect(subject.blocks[9].length).toBe(14); });
    });

    describe("#block setter", function() {
        context("as occupied space", function() {
            When(function() { subject.block(3, 5, 4); });
            Then(function() { expect(subject.blocks[3][5]).toBe(4); });
        });

        context("as unoccupied space", function() {
            When(function() { subject.block(3, 5, null); });
            Then(function() { expect(subject.blocks[3][5]).toBeUndefined(); });
        });
    });

    describe("#block getter", function() {
        var colorNum;
        context("when occupied", function() {
            Given(function() { subject.blocks[2][6] = 3; });
            When(function() { colorNum = subject.block(2,6); });
            Then(function() { expect(colorNum).toBe(3); });
        });

        context("when unoccupied", function() {
            When(function() { colorNum = subject.block(4,3); });
            Then(function() { expect(colorNum).toBeUndefined(); });
        });
    });
});
