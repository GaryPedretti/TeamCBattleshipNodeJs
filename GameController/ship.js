class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
    }

    addPosition(position) {
        this.positions.push(position);
    }

    // ship.js

    isSunk(hits) {
      return this.positions.every(position =>
        hits.some(hit => hit.column === position.column && hit.row === position.row)
      );
    }
  }


module.exports = Ship;