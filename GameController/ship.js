class Ship {
  constructor(name, size, color) {
    this.name = name;
    this.size = size;
    this.color = color;
    this.positions = [];
    this.positionsHit = [];
    this.destroyed = false;
    this.printedMessage = false;
  }

  addPosition(position) {
    this.positions.push(position);
  }

  checkDestroyed() {
    var destroyed = true;

    for (let i = 0; i < this.size; i++) {
      if (!this.positionsHit[i]) {
        destroyed = false;
      }
    }
    return destroyed;
  }
}

module.exports = Ship;
