const assert = require("assert").strict;
const Gameboard = require("../GameController/gameboard");
const cliColor = require("cli-color");

describe("gameboardTest", function () {
  it("should print the gameboard with appropriate colors", function () {
    const gameboard = new Gameboard(3, 3);
    gameboard.table[0][0] = "~";
    gameboard.table[1][1] = "X";
    gameboard.table[2][2] = "B";

    let loggedLines = [];
    const originalConsoleLog = console.log;
    console.log = (line) => loggedLines.push(line);

    gameboard.drawGameBoard();

    const expectedOutput = [
      "   1 2 3",
      " A " +
        cliColor.blue("~") +
        " " +
        cliColor.blue("~") +
        " " +
        cliColor.blue("~"),
      " B " +
        cliColor.blue("~") +
        " " +
        cliColor.red("X") +
        " " +
        cliColor.blue("~"),
      " C " +
        cliColor.blue("~") +
        " " +
        cliColor.blue("~") +
        " " +
        cliColor.white("B"),
    ];

    assert.deepStrictEqual(loggedLines, expectedOutput);
    console.log = originalConsoleLog;
  });
});
