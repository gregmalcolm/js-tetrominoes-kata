describe("Model", function() {
    var subject = undefined;
    Given(function() { this.subject = tetrominoes.model; });
    describe("#init", function() {
        var view = undefined;
        Given(function() {
            this.view = { canvas: { width: 504, height: 612} }
        });
        When(function() { this.subject.init(this.view); });
        Then(function() { return this.subject.canvasWidth  === 504; });
        Then(function() { return this.subject.canvasHeight === 612; });
        Then(function() { return this.subject.blockWidth === 36; });
        Then(function() { return this.subject.blockHeight === 36; });
    });
});
