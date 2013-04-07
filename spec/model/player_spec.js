var app = tetrominoes;

describe("tetrominoes.model.Player", function() {
    var subject, view, gameModel;
    var shape, rotationNum, colorNum;

    var fillLine = function(opts) {
        if (typeof opts.stripeCol2 === "undefined") {
            opts.stripeCol2 = opts.stripeCol1;
        }

        var y = opts.y;
        for (var x = 0; x < subject.model.well.widthInBlocks; x += 2) {
            subject.model.block(x, y, opts.stripeCol1);
            subject.model.block(x + 1, y, opts.stripeCol2);
        }
    };

    Given(function() { view = { canvas: { width: 504, height: 612} }});
    Given(function() { gameModel = app.model.Game.beget(); })
    Given(function() { gameModel.init(view); });
    Given(function() { subject = app.model.Player.beget(gameModel); });
    Given(function() { shape = app.model.shapes()[3]; });
    Given(function() { rotationNum = 0; });
    Given(function() { colorNum = 0; });
    Given(function() { level = 2; });
    Given(function() { subject.gameTime = function() { return 10000; }; });
    Given(function() { app.game.changeGameState = function(){}; });

    describe("construction", function() {
        Then(function() { expect(subject.score).toBe(0); });
    });

    describe("#spawn", function() {
        When(function() { subject.spawn(); });
        Then(function() { expect(subject.x).toBe(4); });

        context("with the long narrow shape in vertical rotation", function() {
            Given(function() { shape = app.model.shapes()[0]; });
            When(function() { subject.spawn(shape, rotationNum, colorNum, level); });

            Then(function() { expect(subject.shape).toBe(app.model.shapes()[0]); });
            Then(function() { expect(subject.rotationNum).toBe(0); });
            Then(function() { expect(subject.colorNum).toBe(0); });
            Then(function() { expect(subject.level).toBe(2); });
        });
    });

    context("with a predetermined shape", function() {
        Given(function() { subject.spawn(shape, rotationNum, 3, 1); });
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

        describe("sliding left", function() {
            var canHSlide;

            context("when enough time has elapsed", function() {
                When(function() { canHSlide = subject.canHSlide(); });
                Then(function() { expect(canHSlide).toBeTruthy(); });

                context("when the player tries to move left", function() {
                    When(function() { subject.slideLeft(); });
                    Then(function() { expect(subject.x).toBe(3); });
                    Then(function() { expect(subject.canHSlide()).toBeFalsy(); });
                });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastHSlideTime = 9999; });
                When(function() { subject.slideLeft(); });
                Then(function() { expect(subject.canHSlide()).toBeFalsy(); });
                Then(function() { expect(subject.x).toBe(4); });

                context("when we want to move sooner", function() {
                    When(function() { subject.cancelHSlideDelay(); });
                    Then(function() { expect(subject.canHSlide()).toBeTruthy(); });
                });
            });
        });

        describe("sliding right", function() {
            context("when enough time has elapsed", function() {
                When(function() { subject.slideRight(); });
                Then(function() { expect(subject.x).toBe(5); });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastHSlideTime = 9999; });
                When(function() { subject.slideRight(); });
                Then(function() { expect(subject.x).toBe(4); });
            });
        });

        describe("sliding down", function() {
            context("when enough time has elapsed", function() {
                When(function() { subject.slideDown(); });
                Then(function() { expect(subject.y).toBe(2); });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastVSlideTime = 9999; });
                When(function() { subject.slideDown(); });
                Then(function() { expect(subject.y).toBe(1); });
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
                    When(function() { subject.cancelRotateDelay(); });
                    Then(function() { expect(subject.canRotate()).toBeTruthy(); });
                });
            });
        });

        describe("#resetHSlideTimer", function() {
            When(function() { subject.resetHSlideDelay(); });
            Then(function() { expect(subject.lastHSlideTime).toBe(10000); });
        });

        describe("#resetVSlideTimer", function() {
            When(function() { subject.resetVSlideDelay(); });
            Then(function() { expect(subject.lastVSlideTime).toBe(10000); });
        });

        describe("#resetFallTimer", function() {
            When(function() { subject.resetFallDelay(); });
            Then(function() { expect(subject.lastFallTime).toBe(10000); });
        });

        describe("#resetRotateTimer", function() {
            When(function() { subject.resetRotateDelay(); });
            Then(function() { expect(subject.lastRotateTime).toBe(10000); });
        });

        describe("apply gravity", function() {
            context("when enough time has elapsed", function() {
                Given(function() { subject.lastFallTime = 0; });
                When(function() { subject.applyGravity(); });
                Then(function() { expect(subject.y).toBe(2); });
            });

            context("when too soon to move", function() {
                Given(function() { subject.lastFallTime = 9999; });
                When(function() { subject.applyGravity(); });
                Then(function() { expect(subject.y).toBe(1); });
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

        describe("#speed", function() {
            var speed;

            Given(function() { subject.level = 1 });
            When(function() { speed = subject.speed() });
            Then(function() { expect(speed).toBe(500) });
        });

        describe("#landShape", function() {
            Given(function() { subject.y = 12; });
            When(function() { subject.landShape(); });
            Then(function() { expect(subject.model.block(4,11)).toBe(3); });
            Then(function() { expect(subject.model.block(4,12)).toBe(3); });
            Then(function() { expect(subject.model.block(5,12)).toBe(3); });
            Then(function() { expect(subject.model.block(5,13)).toBe(3); });

            Then(function() { expect(subject.model.block(3,11)).not.toBeDefined(); });
            Then(function() { expect(subject.lastScoring).not.toBeNull(); });
        });

        describe("#scoringForCompleteLines", function() {
            var scoring;
            context("no lines", function() {
                When(function() {
                    scoring = subject.scoringForCompleteLines(); });
                Then(function() { expect(scoring.lines).toEqual([]); });
                Then(function() { expect(scoring.score).toEqual(0); });
            });

            context("with 1 complete line and color bonus", function() {
                Given(function() { fillLine({y:12, stripeCol1:1}); });
                When(function() {
                    scoring = subject.scoringForCompleteLines(); });
                Then(function() { expect(scoring.lines).toEqual([12]); });
                Then(function() { expect(scoring.linesBonus).toEqual(250); });
                Then(function() { expect(scoring.colorBonus).toEqual(250); });
                Then(function() { expect(scoring.score).toEqual(500); });
            });

            context("with 2 complete lines", function() {
                Given(function() { fillLine({y:8, stripeCol1:3, stripeCol2:2}); });
                Given(function() { fillLine({y:10, stripeCol1:2, stripeCol2:3}); });
                When(function() {
                    scoring = subject.scoringForCompleteLines(); });
                Then(function() { expect(scoring.lines).toEqual([8,10]); });
                Then(function() { expect(scoring.score).toEqual(750); });
            });

            context("with 3 complete lines", function() {
                Given(function() { fillLine({y:8, stripeCol1:3, stripeCol2:2}); });
                Given(function() { fillLine({y:10, stripeCol1:2, stripeCol2:3}); });
                Given(function() { fillLine({y:12, stripeCol1:1, stripeCol2:2}); });
                When(function() {
                    scoring = subject.scoringForCompleteLines(); });
                Then(function() { expect(scoring.lines).toEqual([8, 10, 12]); });
                Then(function() { expect(scoring.score).toEqual(1500); });
            });

            context("with 4 complete lines and color bonus", function() {
                Given(function() { fillLine({y:8, stripeCol1:3}); });
                Given(function() { fillLine({y:9, stripeCol1:3}); });
                Given(function() { fillLine({y:10, stripeCol1:2}); });
                Given(function() { fillLine({y:11, stripeCol1:1}); });
                When(function() {
                    scoring = subject.scoringForCompleteLines(); });
                Then(function() { expect(scoring.lines).toEqual([8, 9, 10, 11]); });
                Then(function() { expect(scoring.colorBonus).toEqual(1000); });
                Then(function() { expect(scoring.score).toEqual(4000); });
            });
        });
    });
});
