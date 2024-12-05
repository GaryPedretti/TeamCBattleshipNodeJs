const assert = require("assert").strict;
const battleship = require("../battleship.js");
const letters = require("../GameController/letters.js");
const position = require("../GameController/position.js");

describe("parsePositionTests", function () {
  it("should return a valid position for valid input", function () {
    var expected = new position("B", 3);
    var actual = battleship.ParsePosition("B3");
    assert.deepStrictEqual(actual, expected);
  });

  it("should return a valid position for valid input, lowercase", function () {
    var expected = new position("B", 3);
    var actual = battleship.ParsePosition("b3");
    assert.deepStrictEqual(actual, expected);
  });

  it("should return an expected string when toString is called", function () {
    var expected = "B3";
    var actual = battleship.ParsePosition("b3");
    assert.deepStrictEqual(actual.toString(), expected);
  });

  it("should return null for if letter is out of range", function () {
    var expected = null;
    var actual = battleship.ParsePosition("Z3");
    assert.deepStrictEqual(actual, expected);
  });

  it("should return null for if number is out of range", function () {
    var expected = null;
    var actual = battleship.ParsePosition("B99");
    assert.deepStrictEqual(actual, expected);
  });

  it("should return null for if the 2nd and third characters are not a valid number", function () {
    var expected = null;
    var actual = battleship.ParsePosition("Bzz");
    assert.deepStrictEqual(actual, expected);
  });
});
