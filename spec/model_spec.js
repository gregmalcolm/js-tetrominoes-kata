describe("tetrominoes.model.Game", function() {
    var subject;
    Given(function() { this.subject = tetrominoes.model.Game.beget(); });
    describe(".init", function() {
        var view;
        Given(function() {
            this.view = { canvas: { width: 504, height: 612} }
        });

        describe("metrics", function() {
            When(function() { this.subject.init(this.view); });
            Then(function() { return this.subject.canvasWidth  === 504; });
            Then(function() { return this.subject.canvasHeight === 612; });
            Then(function() { return this.subject.blockWidth === 36; });
            Then(function() { return this.subject.blockHeight === 36; });
        });

        describe("shapes", function() {
            var shape;
            When(function() { this.subject.init(this.view); });
            Then(function() { return this.subject.shapes.length === 7 });

            describe("#1", function() {
                Given(function() { this.shape = this.subject.shapes[0] });
                Then(function() { return this.shape.positions[1].blocks[3].x === 2; } );
                Then(function() { return this.shape.positions[1].blocks[3].y === 0; } );
            });
        });
    });
});

describe("model.Shape", function() {
    var subject;
    describe("construction", function() {
        context("with only one block", function() {
            When(function() { this.subject = model.Shape.beget({blocks: [["X"]]}) });
            Then(function() { return this.subject.positions[0].blocks[0].x === 0 });
            Then(function() { return this.subject.positions[0].blocks[0].y === 0 });
            Then(function() { return this.subject.positions.length === 1 });
            Then(function() { return this.subject.positions[0].blocks.length === 1 });
        });

        context("with blocks in a horizontal line", function() {
            When(function() { this.subject = model.Shape.beget({blocks: [["XXXX"]]}) });
            Then(function() { return this.subject.positions[0].blocks[3].x === 3 });
            Then(function() { return this.subject.positions[0].blocks[3].y === 0 });
        });

        context("with blocks in a vertical line", function() {
            When(function() { this.subject = model.Shape.beget({blocks: [["X",
                                                                          "X",
                                                                          "X"]]}) });
            Then(function() { return this.subject.positions[0].blocks[2].x === 0 });
            Then(function() { return this.subject.positions[0].blocks[2].y === 2 });
        });

        context("with a zigzag shape", function() {
            When(function() { this.subject = model.Shape.beget({blocks: [["XX",
                                                                          " XX"]]}) });
            Then(function() { return this.subject.positions[0].blocks[3].x === 2 });
            Then(function() { return this.subject.positions[0].blocks[3].y === 1 });
        });

        context("with a zigzag shape and an origin point", function() {
            When(function() { this.subject = model.Shape.beget({blocks: [["XX",
                                                                          " OX"]]}) });
            Then(function() { return this.subject.positions[0].blocks[0].x === -1 });
            Then(function() { return this.subject.positions[0].blocks[0].y === -1 });

            Then(function() { return this.subject.positions[0].blocks[2].x === 0 });
            Then(function() { return this.subject.positions[0].blocks[2].y === 0 });

            Then(function() { return this.subject.positions[0].blocks[3].x === 1 });
            Then(function() { return this.subject.positions[0].blocks[3].y === 0 });

            Then(function() { return this.subject.positions[0].blocks.length === 4 });
        });

        context("with a zigzag shape and an 'invisible' origin point", function() {
            When(function() { this.subject = model.Shape.beget({blocks: [["XX",
                                                                          ".XX"]]}) });

            Then(function() { return this.subject.positions[0].blocks[0].x === 0 });
            Then(function() { return this.subject.positions[0].blocks[0].y === -1 });

            Then(function() { return this.subject.positions[0].blocks.length === 4 });
        });

        context("with a zigzag shape and two positions ", function() {
            When(function() { this.subject = model.Shape.beget({blocks: [["XX",
                                                                          " OX"],

                                                                         [" X",
                                                                          "OX",
                                                                          "X"]]}) });
            Then(function() { return this.subject.positions[1].blocks[3].x === 0 });
            Then(function() { return this.subject.positions[1].blocks[3].y === 1 });
        });
    });
});

describe("model.Player", function() {
//    var subject;
//    Given(function() { this.subject = model. });

//    describe("construction", function() {
//    });
});
