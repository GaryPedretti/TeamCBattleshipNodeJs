class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.shipPositions = [];
        this.misses = [];
        this.hits = [];
    }

    mergeArrays(ship) {
        return this.shipPositions.concat(ship.positions);
    }
    
    shipOutofBounds(ship) {
        // Check if there is position out of bounds
        for (let element of ship.positions) {
            if(element.column > this.width || element.column < 1){
                return true;
            }
            if(element.row > this.height || element.row < 1) {
                return true;
            }
        }
        return false;
    }

    shipNotInConflict(ship){
        // Check if there is any common element
        for (let element of ship.positions) {
            if (this.shipPositions.includes(element)) {
                return false;
            }
        }
        return true;
    }

    expandPosition(ship, position){
        const Position = require("./position.js");
        ship.addPosition(position)
        for(let index = position.row + 1; index < ship.size; index++){
            ship.addPosition(new Position(position.column, index))
        }
        return ship
    }

    addShip(ship, position) {
        var wasAdded = [false, ship];
        ship = this.expandPosition(ship, position);
        if(this.shipOutofBounds(ship)) {
            return wasAdded;
        }
        if(this.shipNotInConflict(ship)) {
            this.mergeArrays(ship);
            wasAdded[0] = true;
        }
        return wasAdded;
    }
}

module.exports = Board;