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
            var blocks;

            Given(function() { rotationNum = 1; });
            Given(function() { subject.spawn(shape, rotationNum); });

            context("using the default rotation", function() {
                When(function() { blocks = subject.localBlocks(); });

                Then(function() { expect(blocks[1].x).toBe(1); });
                Then(function() { expect(blocks[1].y).toBe(0); });

                Then(function() { expect(blocks[2].x).toBe(-1); });
                Then(function() { expect(blocks[2].y).toBe(1); });
            });

            context("using the a specific rotation", function() {
                When(function() { blocks = subject.localBlocks(0); });

                Then(function() { expect(blocks[1].x).toBe(0); });
                Then(function() { expect(blocks[1].y).toBe(0); });

                Then(function() { expect(blocks[2].x).toBe(1); });
                Then(function() { expect(blocks[2].y).toBe(0); });
            });
        });

        describe("#wellBlocks", function() {
            var blocks;

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
            var canSlide;

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
            var time;
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
            var x, y, rotationNum;

            context("with X placement", function() {
                Given(function() { subject.placement._x = 7; });
                When(function() { x = subject.placement.x(); });
                Then(function() { expect(x).toBe(7); });
            });
            context("without X placement", function() {
                When(function() { x = subject.placement.x(); });
                Then(function() { expect(x).toBe(4); });
            });
            context("with Y placement", function() {
                Given(function() { subject.placement._y = 10; });
                When(function() { y = subject.placement.y(); });
                Then(function() { expect(y).toBe(10); });
            });
            context("without Y placement", function() {
                When(function() { y = subject.placement.y(); });
                Then(function() { expect(y).toBe(1); });
            });
            context("with Rotation placement", function() {
                Given(function() { subject.placement._rotationNum = 2; });
                When(function() { rotationNum = subject.placement.rotationNum(); });
                Then(function() { expect(rotationNum).toBe(2); });
            });
            context("without Rotation placement", function() {
                When(function() { rotationNum = subject.placement.rotationNum(); });
                Then(function() { expect(rotationNum).toBe(0); });
            });

            describe("#wellBlocks", function() {
                var blocks;

                When(function() { blocks = subject.placement.wellBlocks(); });

                Then(function() { expect(blocks[1].x).toBe(4); });
                Then(function() { expect(blocks[1].y).toBe(1); });

                Then(function() { expect(blocks[3].x).toBe(5); });
                Then(function() { expect(blocks[3].y).toBe(2); });
            });

            describe("#isValid", function() {
                var valid;

                context("left as far as allowed", function() {
                    Given(function() { subject.placement._x = 0; });
                    When(function() { valid = subject.placement.isValid(); });
                    Then(function() { expect(valid).toBeTruthy(); });
                });
                context("too far left", function() {
                    Given(function() { subject.placement._x = -1; });
                    When(function() { valid = subject.placement.isValid(); });
                    Then(function() { expect(valid).toBeFalsy(); });
                });
                context("right as far as allowed", function() {
                    Given(function() { subject.placement._x = 8; });
                    When(function() { valid = subject.placement.isValid(); });
                    Then(function() { expect(valid).toBeTruthy(); });
                });
                context("too far right", function() {
                    Given(function() { subject.placement._x = 9; });
                    When(function() { valid = subject.placement.isValid(); });
                    Then(function() { expect(valid).toBeFalsy(); });
                });
            });

            describe("#commit", function() {
                var result;

                context("when placement is legal", function() {
                    context("and everything is supposed to change", function() {
                        Given(function() { subject.placement._x = 6; });
                        Given(function() { subject.placement._y = 2; });
                        Given(function() { subject.placement._rotationNum = 1; });

                        When(function() { result = subject.placement.commit(); });
                        Then(function() { expect(result).toBeTruthy(); });

                        Then(function() { expect(subject.x).toBe(6); });
                        Then(function() { expect(subject.y).toBe(2); });
                        Then(function() { expect(subject.rotationNum).toBe(1); });

                        Then(function() { expect(subject.placement._x).toBeNull(); });
                        Then(function() { expect(subject.placement._y).toBeNull(); });
                        Then(function() { expect(subject.placement._rotationNum).toBeNull(); });
                    });
                    context("and only one thing changes", function() {
                        Given(function() { subject.placement._x = 3; });

                        When(function() { result = subject.placement.commit(); });
                        Then(function() { expect(result).toBeTruthy(); });
                        Then(function() { expect(subject.x).toBe(3); });
                        Then(function() { expect(subject.y).toBe(1); });
                        Then(function() { expect(subject.rotationNum).toBe(0); });
                    });
                });

                context("when sliding into an illegal position", function() {
                    Given(function() { subject.placement._x = 10; });

                    When(function() { result = subject.placement.commit(); });
                    Then(function() { expect(result).toBeFalsy(); });
                    Then(function() { expect(subject.x).toBe(4); });
                });

                context("when rotating into an illegal position", function() {
                    Given(function() { subject.placement._x = 0; });
                    Given(function() { subject.placement._rotationNum = 1; });

                    When(function() { result = subject.placement.commit(); });
                    Then(function() { expect(result).toBeFalsy(); });
                    Then(function() { expect(subject.rotationNum).toBe(0); });
                });
            });
        });

    });
});
