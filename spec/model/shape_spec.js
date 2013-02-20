var app = tetrominoes;

describe("tetrominoes.model.Shape", function() {
    var subject;

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


