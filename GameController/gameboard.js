const letters = require("./letters");
const cliColor = require("cli-color");


class Gameboard {
    constructor(columnSize, rowSize) {
        this.columnSize = columnSize;
        this.rowSize = rowSize;
        this.table = Array(columnSize).fill(null).map(() => Array(rowSize).fill("~"));
    }

    getColor(celda) {
        if (celda === "~") return cliColor.blue(celda);
        if (celda === "B") return cliColor.white(celda);
        if (celda === "X") return cliColor.red(celda);
        if (celda === "O") return cliColor.grey(celda);
    }
    
    drawGameBoard() {
        console.log("   " + [...Array(this.table[0].length).keys()].map(x => x + 1).join(" "));
        this.table.forEach((fila, i) => {
            const fileColored = fila.map(this.getColor).join(" ");
            console.log(letters.getKey(i + 1).padStart(2, " ") + " " + fileColored);
        });
    }
}

module.exports = Gameboard;