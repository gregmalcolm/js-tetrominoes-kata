describe("tetrominoes.model", function() {
    var subject;
    Given(function() { this.subject = tetrominoes.model; });
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
            Then(function() { return this.subject.shapes.length === 1 });

            describe("#1", function() {
                Given(function() { this.shape = this.subject.shapes[0] });
//                Then(function() { return this.shape.positions[1].blocks[3].x === 2; } );
//                Then(function() { return this.shape.positions[1].blocks[3].y === 0; } );
            });
        });
    });
});

describe("model.Shape", function() {
    describe(".spawn", function() {
        context("with only one block", function() {
            When(function() { this.shape = model.Shape.spawn({blocks: [["X"]]}) });
            Then(function() { this.shape.positions[0].blocks[0].x === 0 });
        });

    });
});
