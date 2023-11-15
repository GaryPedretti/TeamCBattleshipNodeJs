const assert=require('assert').strict;
const battleship=require("../battleship.js");
const letters=require("../GameController/letters.js");
const position=require("../GameController/position.js")

describe('parsePositionTests', function() {
  it('should return a valid position for valid input', function() {
    var expected = new position(letters.B, 3);
    var actual = battleship.ParsePosition("B3");
    assert.deepStrictEqual(actual, expected);
  });
});

describe('parseShotPositionTests', function() {
  it('should return null for an invalid number in the coordinate', function() {
    const shot = battleship.ParseShotPosition('A20');
    assert.equal(shot, null);
  });
  it('should return null for an invalid letter in the coordinate', function() {
    const shot = battleship.ParseShotPosition('T3');
    assert.equal(shot, null);
  });
  it('should return a valid position for valid input', function () {
    const expected = new position(letters.H, 1);
    const actual = battleship.ParseShotPosition('H1');
    assert.deepStrictEqual(actual, expected);
  });
});