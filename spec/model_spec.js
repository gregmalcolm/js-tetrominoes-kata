var app = tetrominoes;

describe("tetrominoes.model", function() {
    var subject;
    var view;
    Given(function() {
        view = { canvas: { width: 504, height: 612} }
    });

    describe("Game", function() {
        Given(function() { subject = app.model.Game.beget(); });
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
                    Then(function() { return shape.positions[1].blocks[3].x === 2; } );
                    Then(function() { return shape.positions[1].blocks[3].y === 0; } );
                });
            });
        });
    });

    describe("Shape", function() {
        describe("construction", function() {
            context("with only one block", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["X"]]}) });
                Then(function() { return subject.positions[0].blocks[0].x === 0 });
                Then(function() { return subject.positions[0].blocks[0].y === 0 });
                Then(function() { return subject.positions.length === 1 });
                Then(function() { return subject.positions[0].blocks.length === 1 });
            });

            context("with blocks in a horizontal line", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XXXX"]]}) });
                Then(function() { return subject.positions[0].blocks[3].x === 3 });
                Then(function() { return subject.positions[0].blocks[3].y === 0 });
            });

            context("with blocks in a vertical line", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["X",
                                                                              "X",
                                                                              "X"]]}) });
                Then(function() { return subject.positions[0].blocks[2].x === 0 });
                Then(function() { return subject.positions[0].blocks[2].y === 2 });
            });

            context("with a zigzag shape", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              " XX"]]}) });
                Then(function() { return subject.positions[0].blocks[3].x === 2 });
                Then(function() { return subject.positions[0].blocks[3].y === 1 });
            });

            context("with a zigzag shape and an origin point", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              " OX"]]}) });
                Then(function() { return subject.positions[0].blocks[0].x === -1 });
                Then(function() { return subject.positions[0].blocks[0].y === -1 });

                Then(function() { return subject.positions[0].blocks[2].x === 0 });
                Then(function() { return subject.positions[0].blocks[2].y === 0 });

                Then(function() { return subject.positions[0].blocks[3].x === 1 });
                Then(function() { return subject.positions[0].blocks[3].y === 0 });

                Then(function() { return subject.positions[0].blocks.length === 4 });
            });

            context("with a zigzag shape and an 'invisible' origin point", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              ".XX"]]}) });

                Then(function() { return subject.positions[0].blocks[0].x === 0 });
                Then(function() { return subject.positions[0].blocks[0].y === -1 });

                Then(function() { return subject.positions[0].blocks.length === 4 });
            });

            context("with a zigzag shape and two positions ", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              " OX"],

                                                                             [" X",
                                                                              "OX",
                                                                              "X"]]}) });
                Then(function() { return subject.positions[1].blocks[3].x === 0 });
                Then(function() { return subject.positions[1].blocks[3].y === 1 });
            });
        });
    });

    describe("Player", function() {
        var gameModel;
        var shape;
        var positionNum;

        Given(function() { gameModel = app.model.Game.beget(); })
        Given(function() { gameModel.init(view); });
        Given(function() { subject = app.model.Player.beget(gameModel); });
        Given(function() { shape = app.model.shapes()[0]; });
        Given(function() { positionNum = 0; });

        describe("#spawn", function() {
            When(function() { subject.spawn(); });
            Then(function() { expect(subject.x).toBe(4); });

            context("with the long narrow shape in vertical position", function() {
                When(function() { subject.spawn(shape, positionNum); });

                Then(function() { expect(subject.shape).toBe(app.model.shapes()[0]); });
                Then(function() { expect(subject.positionNum).toBe(0); });
            });
        });

        describe("#localPositionNum", function() {
            context("when the shape has 2 rotation positions", function() {
                Given(function() { subject.shape = app.model.shapes()[0]; });

                context("and wraparound occurs", function() {
                    When(function() { positionNum = subject.localPositionNum(3) });
                    Then(function() { expect(positionNum).toBe(1); });
                });

                context("and wraparound is unnecessary", function() {
                    When(function() { positionNum = subject.localPositionNum(1) });
                    Then(function() { expect(positionNum).toBe(1); });
                });
            });

            context("when the shape has 4 rotation positions", function() {
                Given(function() { subject.shape = app.model.shapes()[1]; });

                context("and wraparound occurs", function() {
                    When(function() { positionNum = subject.localPositionNum(10) });
                    Then(function() { expect(positionNum).toBe(2); });
                });

                context("and wraparound is unnecessary", function() {
                    When(function() { positionNum = subject.localPositionNum(3) });
                    Then(function() { expect(positionNum).toBe(3); });
                });
            });
        });

        describe("#localBlocks", function() {
            Given(function() { shape = app.model.shapes()[3]; });
            Given(function() { positionNum = 1; });
            Given(function() { subject.spawn(shape, positionNum); });

            When(function() { blocks = subject.localBlocks(); });

            Then(function() { expect(blocks[1].x).toBe(1); });
            Then(function() { expect(blocks[1].y).toBe(0); });

            Then(function() { expect(blocks[2].x).toBe(-1); });
            Then(function() { expect(blocks[2].y).toBe(1); });
        });
    });
});
