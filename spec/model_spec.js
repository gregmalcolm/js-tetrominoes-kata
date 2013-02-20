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
                    Then(function() { return shape.rotations[1].blocks[3].x === 2; } );
                    Then(function() { return shape.rotations[1].blocks[3].y === 0; } );
                });
            });
        });
    });

    describe("Shape", function() {
        describe("construction", function() {
            context("with only one block", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["X"]]}) });
                Then(function() { return subject.rotations[0].blocks[0].x === 0 });
                Then(function() { return subject.rotations[0].blocks[0].y === 0 });
                Then(function() { return subject.rotations.length === 1 });
                Then(function() { return subject.rotations[0].blocks.length === 1 });
            });

            context("with blocks in a horizontal line", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XXXX"]]}) });
                Then(function() { return subject.rotations[0].blocks[3].x === 3 });
                Then(function() { return subject.rotations[0].blocks[3].y === 0 });
            });

            context("with blocks in a vertical line", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["X",
                                                                              "X",
                                                                              "X"]]}) });
                Then(function() { return subject.rotations[0].blocks[2].x === 0 });
                Then(function() { return subject.rotations[0].blocks[2].y === 2 });
            });

            context("with a zigzag shape", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              " XX"]]}) });
                Then(function() { return subject.rotations[0].blocks[3].x === 2 });
                Then(function() { return subject.rotations[0].blocks[3].y === 1 });
            });

            context("with a zigzag shape and an origin point", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              " OX"]]}) });
                Then(function() { return subject.rotations[0].blocks[0].x === -1 });
                Then(function() { return subject.rotations[0].blocks[0].y === -1 });

                Then(function() { return subject.rotations[0].blocks[2].x === 0 });
                Then(function() { return subject.rotations[0].blocks[2].y === 0 });

                Then(function() { return subject.rotations[0].blocks[3].x === 1 });
                Then(function() { return subject.rotations[0].blocks[3].y === 0 });

                Then(function() { return subject.rotations[0].blocks.length === 4 });
            });

            context("with a zigzag shape and an 'invisible' origin point", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              ".XX"]]}) });

                Then(function() { return subject.rotations[0].blocks[0].x === 0 });
                Then(function() { return subject.rotations[0].blocks[0].y === -1 });

                Then(function() { return subject.rotations[0].blocks.length === 4 });
            });

            context("with a zigzag shape and two rotations ", function() {
                When(function() { subject = app.model.Shape.beget({blocks: [["XX",
                                                                              " OX"],

                                                                             [" X",
                                                                              "OX",
                                                                              "X"]]}) });
                Then(function() { return subject.rotations[1].blocks[3].x === 0 });
                Then(function() { return subject.rotations[1].blocks[3].y === 1 });
            });
        });
    });

    describe("Player", function() {
        var gameModel;
        var shape;
        var rotationNum;

        Given(function() { gameModel = app.model.Game.beget(); })
        Given(function() { gameModel.init(view); });
        Given(function() { subject = app.model.Player.beget(gameModel); });
        Given(function() { shape = app.model.shapes()[3]; });
        Given(function() { rotationNum = 0; });
        Given(function() { subject.gameTime = function() { return 10000; }; });

        describe("#spawn", function() {
            When(function() { subject.spawn(); });
            Then(function() { expect(subject.x).toBe(4); });

            context("with the long narrow shape in vertical rotation", function() {
                Given(function() { shape = app.model.shapes()[0]; });
                When(function() { subject.spawn(shape, rotationNum); });

                Then(function() { expect(subject.shape).toBe(app.model.shapes()[0]); });
                Then(function() { expect(subject.rotationNum).toBe(0); });
            });
        });

        describe("#localRotationNum", function() {
            context("when the shape has 2 rotation rotations", function() {
                Given(function() { subject.shape = app.model.shapes()[0]; });

                context("and wraparound occurs", function() {
                    When(function() { rotationNum = subject.localRotationNum(3) });
                    Then(function() { expect(rotationNum).toBe(1); });
                });

                context("and wraparound is unnecessary", function() {
                    When(function() { rotationNum = subject.localRotationNum(1) });
                    Then(function() { expect(rotationNum).toBe(1); });
                });
            });

            context("when the shape has 4 rotation rotations", function() {
                Given(function() { subject.shape = app.model.shapes()[1]; });

                context("and wraparound occurs", function() {
                    When(function() { rotationNum = subject.localRotationNum(10) });
                    Then(function() { expect(rotationNum).toBe(2); });
                });

                context("and wraparound is unnecessary", function() {
                    When(function() { rotationNum = subject.localRotationNum(3) });
                    Then(function() { expect(rotationNum).toBe(3); });
                });
            });
        });

        describe("#localBlocks", function() {
            Given(function() { rotationNum = 1; });
            Given(function() { subject.spawn(shape, rotationNum); });

            When(function() { blocks = subject.localBlocks(); });

            Then(function() { expect(blocks[1].x).toBe(1); });
            Then(function() { expect(blocks[1].y).toBe(0); });

            Then(function() { expect(blocks[2].x).toBe(-1); });
            Then(function() { expect(blocks[2].y).toBe(1); });
        });

        describe("#wellBlocks", function() {
            Given(function() { rotationNum = 1; });
            Given(function() { subject.spawn(shape, rotationNum); });
            Given(function() { subject.x = 4; });
            Given(function() { subject.y = 8; });

            When(function() { blocks = subject.wellBlocks(); });

            Then(function() { expect(blocks[1].x).toBe(5); });
            Then(function() { expect(blocks[1].y).toBe(8); });

            Then(function() { expect(blocks[2].x).toBe(3); });
            Then(function() { expect(blocks[2].y).toBe(9); });
        });

        context("boundry positions", function() {
            var left, top, right, bottom;
            Given(function() { subject.spawn(shape, rotationNum); });
            Given(function() { subject.y = 10 });

            describe("#left", function() {
                When(function() { left = subject.left(); });
                Then(function() { expect(left).toBe(4); });
            });

            describe("#top", function() {
                When(function() { top = subject.top(); });
                Then(function() { expect(top).toBe(9); });
            });

            describe("#right", function() {
                When(function() { right = subject.right(); });
                Then(function() { expect(right).toBe(5); });
            });

            describe("#bottom", function() {
                When(function() { bottom = subject.bottom(); });
                Then(function() { expect(bottom).toBe(11); });
            });
        });

        describe("moving left", function() {
            context("when enough time has elapsed", function() {
                When(function() { canMove = subject.canMove(); });
                Then(function() { expect(canMove).toBeTruthy(); });

                context("when the player tries to move left", function() {
                    When(function() { subject.slideLeft(); });
                    Then(function() { expect(subject.x).toBe(3); });
                    Then(function() { expect(subject.canMove()).toBeFalsy(); });
                });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastMoveTime = 9999; });
                When(function() { subject.slideLeft(); });
                Then(function() { expect(subject.canMove()).toBeFalsy(); });
                Then(function() { expect(subject.x).toBe(4); });
            });
        });

        describe("moving right", function() {
            context("when enough time has elapsed", function() {
                When(function() { canMove = subject.canMove(); });
                Then(function() { expect(canMove).toBeTruthy(); });

                context("when the player tries to move left", function() {
                    When(function() { subject.slideRight(); });
                    Then(function() { expect(subject.x).toBe(5); });
                });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastMoveTime = 9999; });
                When(function() { subject.slideRight(); });
                Then(function() { expect(subject.x).toBe(4); });
            });
        });

        describe("#elapsedTime", function() {

            context("for 500ms wait", function() {
                When(function() { time = subject.elapsedTime(9500); });
                Then(function() { expect(time).toBe(500) });
            });
            context("for 700ms wait", function() {
                When(function() { time = subject.elapsedTime(9300); });
                Then(function() { expect(time).toBe(700) });
            });
        });
    });
});
