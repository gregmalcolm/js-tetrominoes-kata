var app = tetrominoes;

describe("tetrominoes.model.Well", function() {
    var left, top, right, bottom;

    Given(function() { subject = app.model.Well.beget(); });

    describe("#left", function() {
        When( function() { left = subject.left(); });
        Then( function() { expect(left).toBe(0); });
    });

    describe("#top", function() {
        When( function() { top = subject.top(); });
        Then( function() { expect(top).toBe(0); });
    });

    describe("#right", function() {
        When( function() { right = subject.right(); });
        Then( function() { expect(right).toBe(9); });
    });

    describe("#bottom", function() {
        When( function() { bottom = subject.bottom(); });
        Then( function() { expect(bottom).toBe(13); });
    });

});
