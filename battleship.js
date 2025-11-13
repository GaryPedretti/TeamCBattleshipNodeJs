const readline = require('readline-sync');
const cliColor = require('cli-color');
const beep = require('beepbeep');
const letters = require("./GameController/letters.js");
const position = require("./GameController/position.js");
const gameController = require("./GameController/gameController.js");
const { Worker } = require('worker_threads');

class Board {
    constructor(size = 8) {
        this.size = size;
        this.grid = Array.from({ length: size + 1 }, () => Array(size + 1).fill(null));
    }

    markHit(pos) { this.grid[pos.row][pos.column] = 'hit'; }
    markMiss(pos) { this.grid[pos.row][pos.column] = 'miss'; }
    markShip(pos) { this.grid[pos.row][pos.column] = 'ship'; }

    printBoard(title, showShips = false) {
        const hitColor = cliColor.red;
        const missColor = cliColor.blue;
        const shipColor = cliColor.green;
        const waterColor = cliColor.white;

        console.log(cliColor.cyan(`\n${title}\n`));
        let header = '   A B C D E F G H';
        console.log(header);
        for (let row = 1; row <= this.size; row++) {
            let line = `${row} `;
            if (row < 10) line += ' ';
            for (let col = 1; col <= this.size; col++) {
                const cell = this.grid[row][col];
                if (cell === 'hit') line += hitColor('X ');
                else if (cell === 'miss') line += missColor('O ');
                else if (cell === 'ship' && showShips) line += shipColor('S ');
                else line += waterColor('. ');
            }
            console.log(line);
        }
    }
}


class Battleship {
    constructor() {
        this.boardSize = 8;
        this.myBoard = new Board(this.boardSize);
        this.enemyBoard = new Board(this.boardSize);
        this.telemetryWorker = null;
    }

    start() {
        this.telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");
        this.telemetryWorker.postMessage({ eventName: 'ApplicationStarted', properties: { Technology: 'Node.js' } });

        console.log(cliColor.magenta("\n=== Welcome to Battleship ===\n"));

        this.initializeGame();
        this.gameLoop();
    }

    initializeGame() {
        this.initializeMyFleet();
        this.initializeEnemyFleet();
    }

   initializeMyFleet() {
    this.myFleet = gameController.InitializeShips();

    if (false) {
        console.log(cliColor.yellow("Please position your fleet (A–H for columns, 1–8 for rows):"));

        this.myFleet.forEach(ship => {
            console.log(cliColor.yellow(`\nPosition your ${ship.name} (size: ${ship.size}):`));

            for (let i = 1; i <= ship.size; i++) {
                const posInput = readline.question(`Enter position ${i} of ${ship.size} (e.g., A3): `);
                const pos = Battleship.parsePosition(posInput);

                this.myBoard.markShip(pos);
                ship.addPosition(pos);

                this.telemetryWorker.postMessage({
                    eventName: 'Player_PlaceShipPosition',
                    properties: {
                        Position: posInput,
                        Ship: ship.name,
                        PositionInShip: i
                    }
                });
            }
        });
    } else {
        // Hardcoded for simplicity
        this.myFleet[0].addPosition(new position(letters.B, 4));
        this.myFleet[0].addPosition(new position(letters.B, 5));
        this.myFleet[0].addPosition(new position(letters.B, 6));
        this.myFleet[0].addPosition(new position(letters.B, 7));
        this.myFleet[0].addPosition(new position(letters.B, 8));

        this.myFleet[1].addPosition(new position(letters.E, 5));
        this.myFleet[1].addPosition(new position(letters.E, 6));
        this.myFleet[1].addPosition(new position(letters.E, 7));
        this.myFleet[1].addPosition(new position(letters.E, 8));

        this.myFleet[2].addPosition(new position(letters.A, 3));
        this.myFleet[2].addPosition(new position(letters.B, 3));
        this.myFleet[2].addPosition(new position(letters.C, 3));

        this.myFleet[3].addPosition(new position(letters.F, 8));
        this.myFleet[3].addPosition(new position(letters.G, 8));
        this.myFleet[3].addPosition(new position(letters.H, 8));

        this.myFleet[4].addPosition(new position(letters.C, 5));
        this.myFleet[4].addPosition(new position(letters.C, 6));
    }
}
    initializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        // Hardcoded for simplicity
        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));
        this.enemyFleet[1].addPosition(new position(letters.E, 9));

        this.enemyFleet[2].addPosition(new position(letters.A, 3));
        this.enemyFleet[2].addPosition(new position(letters.B, 3));
        this.enemyFleet[2].addPosition(new position(letters.C, 3));

        this.enemyFleet[3].addPosition(new position(letters.F, 8));
        this.enemyFleet[3].addPosition(new position(letters.G, 8));
        this.enemyFleet[3].addPosition(new position(letters.H, 8));

        this.enemyFleet[4].addPosition(new position(letters.C, 5));
        this.enemyFleet[4].addPosition(new position(letters.C, 6));
    }

    gameLoop() {
        const msgColor = cliColor.yellow;

        while (!gameController.allShipsSunk(this.myFleet) && !gameController.allShipsSunk(this.enemyFleet)) {
            console.clear();

            console.log(cliColor.magenta("\n================ PLAYER TURN ================\n"));
            this.enemyBoard.printBoard("Enemy Board", false);

            console.log(msgColor("Next possible steps:"));
            console.log(msgColor("- Enter coordinates to shoot (e.g., A3)"));
            console.log(msgColor("- Type 'board' to see your fleet"));
            console.log(msgColor("- Type 'exit' to quit"));
            console.log();

            let input = readline.question("Enter coordinates for your shot: ").toUpperCase();

            if (input === 'EXIT') break;
            if (input === 'BOARD') {
                this.myBoard.printBoard("My Fleet", true);
                input = readline.question("Enter coordinates for your shot: ").toUpperCase();
            }

            const playerPos = Battleship.parsePosition(input);
            const isHit = gameController.CheckIsHit(this.enemyFleet, playerPos);

            if (isHit) {
                this.enemyBoard.markHit(playerPos);
                beep();
                console.log(cliColor.red("\nHit!"));
            } else {
                this.enemyBoard.markMiss(playerPos);
                console.log(cliColor.blue("\nMiss!"));
            }

            this.telemetryWorker.postMessage({
                eventName: 'Player_ShootPosition',
                properties: { Position: input, IsHit: isHit }
            });

            // Computer turn
            console.log(cliColor.magenta("\n================ COMPUTER TURN ================\n"));
            const computerPos = this.getRandomPosition();
            const compHit = gameController.CheckIsHit(this.myFleet, computerPos);

            if (compHit) {
                this.myBoard.markHit(computerPos);
                beep();
                console.log(cliColor.red(`Computer hits at ${computerPos.column}${computerPos.row}!`));
            } else {
                this.myBoard.markMiss(computerPos);
                console.log(cliColor.blue(`Computer misses at ${computerPos.column}${computerPos.row}.`));
            }

            this.telemetryWorker.postMessage({
                eventName: 'Computer_ShootPosition',
                properties: { Position: `${computerPos.column}${computerPos.row}`, IsHit: compHit }
            });

            readline.question(cliColor.cyan("\nPress Enter to continue..."));
        }

        console.log(cliColor.magenta("\n=== GAME OVER ===\n"));
        if (gameController.allShipsSunk(this.enemyFleet)) console.log(cliColor.green("You won!"));
        else console.log(cliColor.red("You lost!"));

        this.telemetryWorker.postMessage({ eventName: 'ApplicationEnded' });
        this.telemetryWorker.terminate();
    }

    getRandomPosition() {
        const row = Math.floor(Math.random() * this.boardSize) + 1;
        const col = Math.floor(Math.random() * this.boardSize) + 1;
        const letter = letters.get(col);
        return new position(letter, row);
    }

    static parsePosition(input) {
        const letter = letters.get(input[0].toUpperCase());
        const number = parseInt(input.slice(1), 10);
        return new position(letter, number);
    }
}

module.exports = Battleship;
