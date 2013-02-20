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

});
