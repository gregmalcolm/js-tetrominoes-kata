var app = tetrominoes;

describe("tetrominoes.model", function() {
    var subject;
    var view;
    Given(function() { view = { canvas: { width: 504, height: 612} }});

    var fillLine = function(opts) {
        if (typeof opts.stripeCol2 === "undefined") {
            opts.stripeCol2 = opts.stripeCol1;
        }

        var y = opts.y;
        for (var x = 0; x < subject.well.widthInBlocks; x += 2) {
            subject.block(x, y, opts.stripeCol1);
            subject.block(x + 1, y, opts.stripeCol2);
        }
    };

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

    describe("#removeLines", function() {
        context("remove 3 lines", function() {
            Given(function() { fillLine({y:9, stripeCol1: 1, stripeCol2: null}); });
            Given(function() { fillLine({y:10, stripeCol1: 2}); });
            Given(function() { fillLine({y:11, stripeCol1: null, stripeCol2: 3}); });
            Given(function() { fillLine({y:12, stripeCol1: 4}); });
            Given(function() { fillLine({y:13, stripeCol1: 5}); });

            When(function() { subject.removeLines([10, 12, 13]); });

            Then(function() { expect(subject.block(0,13)).toBeUndefined(); });
            Then(function() { expect(subject.block(9,13)).toBe(3); });

            Then(function() { expect(subject.block(0,12)).toBe(1); });
            Then(function() { expect(subject.block(9,12)).toBe(undefined); });

            Then(function() { expect(subject.block(0,11)).toBe(undefined); });
            Then(function() { expect(subject.block(9,11)).toBe(undefined); });
        });
    });
});
