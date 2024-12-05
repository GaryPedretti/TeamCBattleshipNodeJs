const { Worker, isMainThread } = require("worker_threads");
const readline = require("readline-sync");
const gameController = require("./GameController/gameController.js");
const cliColor = require("cli-color");
const beep = require("beepbeep");
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
const { matchesGlob } = require("path");
const Ship = require("./GameController/ship.js");
const { exit } = require("process");
const gameboardController = require("./GameController/gameboard.js");
let telemetryWorker;
let playGame = true;
let gameboard;

class Battleship {
  start() {
    telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");

    console.log("Starting...");
    telemetryWorker.postMessage({
      eventName: "ApplicationStarted",
      properties: { Technology: "Node.js" },
    });

    console.log(cliColor.magenta("                                     |__"));
    console.log(cliColor.magenta("                                     |\\/"));
    console.log(cliColor.magenta("                                     ---"));
    console.log(cliColor.magenta("                                     / | ["));
    console.log(cliColor.magenta("                              !      | |||"));
    console.log(
      cliColor.magenta("                            _/|     _/|-++'"),
    );
    console.log(
      cliColor.magenta("                        +  +--|    |--|--|_ |-"),
    );
    console.log(
      cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"),
    );
    console.log(
      cliColor.magenta(
        "                    +---------------___[}-_===_.'____                 /\\",
      ),
    );
    console.log(
      cliColor.magenta(
        "                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _",
      ),
    );
    console.log(
      cliColor.magenta(
        " __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7",
      ),
    );
    console.log(
      cliColor.magenta(
        "|                        Welcome to Battleship                         BB-61/",
      ),
    );
    console.log(
      cliColor.magenta(
        " \\_________________________________________________________________________|",
      ),
    );
    console.log();

    do {
      this.InitializeGame();
      this.StartGame();
    } while (this.playAgain());

    exit();
  }

  StartGame() {
    console.clear();
    console.log("                  __");
    console.log("                 /  \\");
    console.log("           .-.  |    |");
    console.log("   *    _.-'  \\  \\__/");
    console.log("    \\.-'       \\");
    console.log("   /          _/");
    console.log("  |      _  /");
    console.log("  |     /_\\'");
    console.log("   \\    \\_/");
    console.log('    """"');

    do {
      console.log();
      console.log(
        "------------------------------------------------------------------------",
      );
      Battleship.WriteConsoleColoredMessage(
        `Player, it's your turn`,
        cliColor.green,
      );
      Battleship.WriteConsoleColoredMessage(
        `Enter coordinates for your shot (i.e A3):`,
        cliColor.green,
      );
      var position = Battleship.ParsePosition(readline.question());
      var isHit = gameController.CheckIsHit(this.enemyFleet, position);

      telemetryWorker.postMessage({
        eventName: "Player_ShootPosition",
        properties: { Position: position.toString(), IsHit: isHit },
      });

      if (isHit) {
        beep();

        console.log("                \\         .  ./");
        console.log('              \\      .:";\'.:.."   /');
        console.log("                  (M^^.^~~:.'\").");
        console.log("            -   (/  .    . . \\ \\)  -");
        console.log("               ((| :. ~ ^  :. .|))");
        console.log("            -   (\\- |  \\ /  |  /)  -");
        console.log("                 -\\  \\     /  /-");
        console.log("                   \\  \\   /  /");
        Battleship.WriteConsoleColoredMessage(`Yeah! Nice hit!`, cliColor.red);
      } else {
        Battleship.WriteConsoleColoredMessage(`Miss`, cliColor.blue);
      }

      var computerPos = this.GetRandomPosition();
      var isHit = gameController.CheckIsHit(this.myFleet, computerPos);

      telemetryWorker.postMessage({
        eventName: "Computer_ShootPosition",
        properties: { Position: computerPos.toString(), IsHit: isHit },
      });

      console.log();
      console.log(
        "------------------------------------------------------------------------",
      );

      if (isHit) {
        Battleship.WriteConsoleColoredMessage(
          `Computer shot in ${computerPos.column}${computerPos.row} and has hit your ship!`,
          cliColor.red,
        );
      } else {
        Battleship.WriteConsoleColoredMessage(
          `Computer shot in ${computerPos.column}${computerPos.row} and has missed!`,
          cliColor.blue,
        );
      }

      if (isHit) {
        beep();

        console.log("                \\         .  ./");
        console.log('              \\      .:";\'.:.."   /');
        console.log("                  (M^^.^~~:.'\").");
        console.log("            -   (/  .    . . \\ \\)  -");
        console.log("               ((| :. ~ ^  :. .|))");
        console.log("            -   (\\- |  \\ /  |  /)  -");
        console.log("                 -\\  \\     /  /-");
        console.log("                   \\  \\   /  /");
      }

      if (this.CheckForGameEnd()) {
        break;
      }
    } while (true);
  }

  static WriteConsoleColoredMessage(str, color) {
    console.log(color(str));
  }

  CheckForGameEnd() {
    var fleetDestroyed = true;
    this.myFleet.forEach(function (ship) {
      if (!ship.checkDestroyed()) {
        fleetDestroyed = false;
      } else if (!ship.printedMessage) {
        Battleship.WriteConsoleColoredMessage(
          `Your ${ship.name} is destroyed!`,
          cliColor.yellow,
        );
        ship.printedMessage = true;
      }
    });

    if (fleetDestroyed) {
      Battleship.WriteConsoleColoredMessage("You have lost!", cliColor.yellow);
      return true;
    }

    var enemyDestroyed = true;
    this.enemyFleet.forEach(function (ship) {
      if (!ship.checkDestroyed()) {
        enemyDestroyed = false;
      } else if (!ship.printedMessage) {
        Battleship.WriteConsoleColoredMessage(
          `The enemies ${ship.name} is destroyed!`,
          cliColor.yellow,
        );
        ship.printedMessage = true;
      }
    });

    if (enemyDestroyed) {
      Battleship.WriteConsoleColoredMessage("You have won!", cliColor.yellow);
      return true;
    }

    return false;
  }

  static ParsePosition(input) {
    var letter = letters.get(input.toUpperCase().substring(0, 1));
    var number = parseInt(input.substring(1, 2), 10);
    return new position(letter, number);
  }

  GetRandomPosition() {
    var rows = 8;
    var lines = 8;
    var rndColumn = Math.floor(Math.random() * lines);
    var letter = letters.get(rndColumn + 1);
    var number = Math.floor(Math.random() * rows);
    var result = new position(letter, number);
    return result;
  }

  InitializeGame() {
    this.InitializeMyFleet();
    this.InitializeEnemyFleet();
  }

  InitializeMyFleet() {
    this.myFleet = gameController.InitializeShips();
    this.gameboard = new gameboardController(letters.H.value, 8);

    console.log(
      "------------------------------------------------------------------------",
    );
    Battleship.WriteConsoleColoredMessage(
      "Please position your fleet (Game board size is from A to H and 1 to 8) :",
      cliColor.green,
    );
    this.gameboard.drawGameBoard();

    this.myFleet.forEach(function (ship) {
      console.log();
      Battleship.WriteConsoleColoredMessage(
        `Please enter the positions for the ${ship.name} (size: ${ship.size})`,
        cliColor.green,
      );
      for (var i = 1; i < ship.size + 1; i++) {
        Battleship.WriteConsoleColoredMessage(
          `Enter position ${i} of ${ship.size} (i.e A3):`,
          cliColor.green,
        );
        const position = readline.question();
        telemetryWorker.postMessage({
          eventName: "Player_PlaceShipPosition",
          properties: {
            Position: position,
            Ship: ship.name,
            PositionInShip: i,
          },
        });
        ship.addPosition(Battleship.ParsePosition(position));
      }
    });
  }

  InitializeEnemyFleet() {
    this.enemyFleet = gameController.InitializeShips();

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

  playAgain() {
    console.log(
      "------------------------------------------------------------------------",
    );
    let reply = "";
    do {
      console.log(cliColor.green("Do you want to play again? (Y/N)"));
      reply = readline.question();
    } while (reply.toLowerCase() !== "y" && reply.toLowerCase() !== "n");

    return reply.toUpperCase() === "Y" ? true : false;
  }
}

module.exports = Battleship;
