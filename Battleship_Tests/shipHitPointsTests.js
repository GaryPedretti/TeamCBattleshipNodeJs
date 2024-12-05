const assert = require("assert").strict;
const battleship = require("../battleship.js");
const gameController = require("../GameController/gameController.js");
const letters = require("../GameController/letters.js");
const Position = require("../GameController/position.js");
const position = require("../GameController/position.js");
const Ship = require("../GameController/ship.js");
const cliColor = require("cli-color");

describe("shipHitPointsTests", function () {
  it("Ship should store a hit when hit", function () {
    var Position = new position(letters.B, 3);
    var colors = require("cli-color");
    var acShip = new Ship("Aircraft Carrier", 1, colors.CadetBlue);
    var ships = [acShip];
    acShip.addPosition(Position);

    gameController.CheckIsHit(ships, Position);

    assert.deepStrictEqual(acShip.positionsHit[0], true);
  });

  it("Ship should store the same amount of potential hits as it has positions, no more", function () {
    var colors = require("cli-color");
    for( let i = 2; i < 5; i++ )
    {
       var ship = new Ship("Test Ship", i, colors.black );
       for( let j = 0; j < i; j++ )
       {
          ship.addPosition( letters.A, j );
       }
       assert.deepStrictEqual( ship.positionsHit.length, i )
    }
  });

  it("The game should not end once fleets have been created", function () {
    var colors = require("cli-color");
    var ship1 = new Ship("Test Ship", 2, colors.black );
    var ship2 = new Ship("Test Ship", 3, colors.black );

    ship1.addPosition( letters.A, 1 );
    ship1.addPosition( letters.A, 2 );

    ship2.addPosition( letters.B, 1 );
    ship2.addPosition( letters.B, 2 );
    ship2.addPosition( letters.B, 3 );

    var enemyFleet = [ ship1, ship2 ];
    var myFleet = [ ship1, ship2 ];

    assert.equal( battleship.CheckForGameEnd( myFleet, enemyFleet ), false );
  });

  it("The game should not end if only some of the enemy fleet is destroyed", function () {
    var colors = require("cli-color");
    var ship1 = new Ship("Test Ship", 2, colors.black );
    var ship2 = new Ship("Test Ship", 3, colors.black );

    var positionA1 = new Position( letters.A, 1 );
    var positionA2 = new Position( letters.A, 2 );

    ship1.addPosition( positionA1 );
    ship1.addPosition( positionA2 );

    var positionB1 = new Position( letters.B, 1 );
    var positionB2 = new Position( letters.B, 2 );
    var positionB3 = new Position( letters.B, 3 );

    ship2.addPosition( positionB1 );
    ship2.addPosition( positionB2 );
    ship2.addPosition( positionB3 );

    var enemyFleet = [ ship1, ship2 ];
    var myFleet = [ ship1, ship2 ];

    gameController.CheckIsHit( enemyFleet, positionA1 );
    gameController.CheckIsHit( enemyFleet, positionA2 );

    assert.equal( battleship.CheckForGameEnd( myFleet, enemyFleet ), false );

  });

  it("The game should be won once the enemy fleet has been destroyed", function () {
    var colors = require("cli-color");
    var enemyShip1 = new Ship("Enemy Test Ship 1", 2, colors.black );
    var enemyShip2 = new Ship("Enemy Test Ship 2", 3, colors.black );

    var myShip1 = new Ship("My Test Ship 1", 2, colors.black );
    var myShip2 = new Ship("My Test Ship 2", 3, colors.black );

    var positionA1 = new Position( letters.A, 1 );
    var positionA2 = new Position( letters.A, 2 );

    enemyShip1.addPosition( positionA1 );
    enemyShip1.addPosition( positionA2 );

    myShip1.addPosition( positionA1 );
    myShip1.addPosition( positionA2 );

    var positionB1 = new Position( letters.B, 1 );
    var positionB2 = new Position( letters.B, 2 );
    var positionB3 = new Position( letters.B, 3 );

    enemyShip2.addPosition( positionB1 );
    enemyShip2.addPosition( positionB2 );
    enemyShip2.addPosition( positionB3 );

    myShip2.addPosition( positionB1 );
    myShip2.addPosition( positionB2 );
    myShip2.addPosition( positionB3 );

    var enemyFleet = [ enemyShip1, enemyShip2 ];
    var myFleet = [ myShip1, myShip2 ];

    gameController.CheckIsHit( enemyFleet, positionA1 );
    gameController.CheckIsHit( enemyFleet, positionA2 );

    gameController.CheckIsHit( enemyFleet, positionB1 );
    gameController.CheckIsHit( enemyFleet, positionB2 );
    gameController.CheckIsHit( enemyFleet, positionB3 );

    assert.equal( battleship.CheckForGameEnd( myFleet, enemyFleet ), true );

  });
});



