var app = tetrominoes;

describe("tetrominoes.model.Player", function() {
    var subject;
    var view;
    var gameModel;
    var shape;
    var rotationNum;

    Given(function() { view = { canvas: { width: 504, height: 612} }});
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

    context("with a predetermined shape", function() {
        Given(function() { subject.spawn(shape, rotationNum); });
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
                When(function() { canSlide = subject.canSlide(); });
                Then(function() { expect(canSlide).toBeTruthy(); });

                context("when the player tries to move left", function() {
                    When(function() { subject.slideLeft(); });
                    Then(function() { expect(subject.x).toBe(3); });
                    Then(function() { expect(subject.canSlide()).toBeFalsy(); });
                });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastSlideTime = 9999; });
                When(function() { subject.slideLeft(); });
                Then(function() { expect(subject.canSlide()).toBeFalsy(); });
                Then(function() { expect(subject.x).toBe(4); });

                context("when we want to move sooner", function() {
                    When(function() { subject.resetSlideDelay(); });
                    Then(function() { expect(subject.canSlide()).toBeTruthy(); });
                });
            });
        });

        describe("moving right", function() {
            context("when enough time has elapsed", function() {
                When(function() { subject.slideRight(); });
                Then(function() { expect(subject.x).toBe(5); });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastSlideTime = 9999; });
                When(function() { subject.slideRight(); });
                Then(function() { expect(subject.x).toBe(4); });
            });
        });

        describe("rotate", function() {
            context("when enough time has elapsed", function() {
                When(function() { subject.rotate(); });
                Then(function() { expect(subject.rotationNum).toBe(1); });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastRotateTime = 9999; });
                When(function() { subject.rotate(); });
                Then(function() { expect(subject.rotationNum).toBe(0); });

                context("when we want to move sooner", function() {
                    When(function() { subject.resetRotateDelay(); });
                    Then(function() { expect(subject.canRotate()).toBeTruthy(); });
                });
            });
        });

        describe("#elapsedTime", function() {
            context("for 500ms wait", function() {
                When(function() { time = subject.elapsedTime(9500); });
                Then(function() { expect(time).toBe(500); });
            });
            context("for 700ms wait", function() {
                When(function() { time = subject.elapsedTime(9300); });
                Then(function() { expect(time).toBe(700); });
            });
        });

        describe("#placement", function() {
            Given(function() { subject.placement._x = 7; });
            When(function() { x = subject.placement.x(); });
            Then(function() { expect(x).toBe(7); });
        });

        //describe("#commitPlacement"), function() {
            //context("with a valid placement", function() {
              //Given(function() { subject.placement.x =  }
            //});
        //});
    });
});
