class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.shipPositions = [];
        this.misses = [];
    }

    mergeArrays(ship) {
        return this.shipPositions.concat(ship.positions);
    }
    
    shipOutofBounds(ship) {
        // Check if there is position out of bounds
        for (let element of ship.positions) {
            if(element.column > this.width || element.column < 0){
                return true;
            }
            if(element.row > this.height || element.row < 0) {
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

    addShip(ship) {
        var wasAdded = false;
        if(this.shipOutofBounds(ship)) {
            return false;
        }
        if(this.shipNotInConflict(ship)) {
            mergeArrays();
            wasAdded = true;
        }
        return wasAdded;
    }
}

module.exports = Board;