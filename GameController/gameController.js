const colors = require("cli-color");
const Ship = require("./ship.js");

class GameController {
    static InitializeShips() {
        return [
            new Ship("Aircraft Carrier", 5, colors.cyan),
            new Ship("Battleship", 4, colors.red),
            new Ship("Submarine", 3, colors.green),
            new Ship("Destroyer", 3, colors.yellow),
            new Ship("Patrol Boat", 2, colors.magenta)
        ];
    }

    // Returns true if a shot hits a ship
    static CheckIsHit(ships, shot) {
        if (!shot) throw "The shooting position is not defined";
        if (!ships) throw "No ships defined";

        let hit = false;
        ships.forEach(ship => {
            ship.positions.forEach(pos => {
                if (pos.row === shot.row && pos.column === shot.column) {
                    hit = true;
                    pos.hit = true; // Mark this position as hit
                }
            });
        });
        return hit;
    }

    // Returns true if a ship is completely sunk
    static isSunk(ship) {
        return ship.positions.every(pos => pos.hit);
    }

    // Returns true if all ships in a fleet are sunk
    static allShipsSunk(fleet) {
        return fleet.every(ship => this.isSunk(ship));
    }

    // Validate if a ship has enough positions
    static isShipValid(ship) {
        return ship.positions.length === ship.size;
    }
}

module.exports = GameController;