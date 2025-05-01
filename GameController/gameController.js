class GameController {
    static InitializeShips() {
        var colors = require("cli-color");
        const Board = require("./board.js");
        const Ship = require("./ship.js");
        this.myBoard = new Board(8, 8);
        this.enemyBoard = new Board(8, 8);
        var ships = [
            new Ship("Aircraft Carrier", 5, colors.CadetBlue),
            new Ship("Battleship", 4, colors.Red),
            new Ship("Submarine", 3, colors.Chartreuse),
            new Ship("Destroyer", 3, colors.Yellow),
            new Ship("Patrol Boat", 2, colors.Orange)
        ];
        return ships;
    }

    static CheckIsHit(ships, shot) {
        if (shot == undefined)
            throw "The shooting position is not defined";
        if (ships == undefined)
            throw "No ships defined";
        var returnvalue = [false, null];
        ships.forEach(function (ship) {
            ship.positions.forEach(position => {
                if (position.row == shot.row && position.column == shot.column)
                    ship.logHit();
                    returnvalue = [true, ship];
            });
        });
        return returnvalue;
    }

    static isShipValid(ship) {
        return ship.positions.length == ship.size;
    }
    static CheckForFleetSunk(ships)
    {
        var shipssunk = true;
        ships.forEach(function(ship){
            if (!ship.sunk)
            {
                shipssunk = false;
            }
        });
        return shipssunk;
    }
}

module.exports = GameController;