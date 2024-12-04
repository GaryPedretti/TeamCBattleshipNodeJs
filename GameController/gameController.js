const cliColor = require("cli-color");
const Battleship = require("../battleship.js");

class GameController {
  static InitializeShips() {
    var colors = require("cli-color");
    const Ship = require("./ship.js");
    var ships = [
      new Ship("Aircraft Carrier", 5, colors.CadetBlue),
      new Ship("Battleship", 4, colors.Red),
      new Ship("Submarine", 3, colors.Chartreuse),
      new Ship("Destroyer", 3, colors.Yellow),
      new Ship("Patrol Boat", 2, colors.Orange),
    ];
    return ships;
  }

  static CheckIsHit(ships, shot) {
    if (shot == undefined) throw "The shooting position is not defined";
    if (ships == undefined) throw "No ships defined";
    var returnvalue = false;
    var positionArrayIndex = 0;
    ships.forEach(function (ship) {
      positionArrayIndex = 0;
      ship.positions.forEach((position) => {
        if (position.row == shot.row && position.column == shot.column)
        {
          ship.positionsHit[positionArrayIndex] = true;
          //console.log(`Ship ${ship.name} hit at ${position.column}${position.row} (position hit: ${positionArrayIndex})` );
          returnvalue = true;
        }
        positionArrayIndex++;
      });
    });
    return returnvalue;
  }

  static isShipValid(ship) {
    return ship.positions.length == ship.size;
  }
}

module.exports = GameController;
