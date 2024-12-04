const assert = require("assert").strict;
const battleship = require("../battleship.js");
const gameController = require("../GameController/gameController.js");
const letters = require("../GameController/letters.js");
const position = require("../GameController/position.js");
const Ship = require("../GameController/ship.js");
const cliColor = require("cli-color");

describe("shipHitPointsTests", function () {
  it("Ship should store a hit when hit", function () {
    var Position = new position(letters.B, 3);
    var colors = require("cli-color");
    var acShip = new Ship("Aircraft Carrier", 1, colors.CadetBlue);
    var ships = [acShip];
    acShip.addPosition(Position);

    gameController.CheckIsHit(ships, Position);

    assert.deepStrictEqual(acShip.positionsHit[0], true);
  });
});
