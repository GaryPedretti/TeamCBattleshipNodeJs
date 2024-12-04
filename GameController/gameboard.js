const Letters = require("./letters");

class Gameboard {
    constructor(columnSize, rowSize) {
        this.columnSize = columnSize;
        this.rowSize = rowSize;
    }

    drawGameBoard() {
        let table = "";
        for (let x = 1; x < this.columnSize; x++) {
            let row = "";
            for (let y = 1; y < this.rowSize; y++) {
                row += `${Letters.get(y)}${x}\t`;
            }
            table += row.trim() + "\n";
        } 
        console.log(table);
    }

}

module.exports = Gameboard;