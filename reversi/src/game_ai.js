// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var readline = require("readline");
  var Piece = require("./piece.js");
  var Board = require("./board.js");
  var AI = require("./ai.js");
}
// DON'T TOUCH THIS CODE

/**
 * Sets up the game with a board and the first player to play a turn.
 */
function Game () {
  this.board = new Board();

  if (Math.random() > 0.5) {
    this.player = "human";
    this.ai = new AI("white", this.board);
  } else {
    this.ai = new AI("black", this.board);
    this.player = "ai";
  }
  this.turn = "black"
};

/**
 * Flips the current turn to the opposite color.
 */
Game.prototype._flipTurn = function () {
  this.turn = (this.turn == "black") ? "white" : "black";
};

Game.prototype._flipPlayer = function () {
  this.player = (this.player == "human") ? "ai" : "human";
};

// Dreaded global state!
let rlInterface;

/**
 * Creates a readline interface and starts the run loop.
 */
Game.prototype.play = function () {
  rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  this.runLoop(function () {
    rlInterface.close();
    rlInterface = null;
  });
};

/**
 * Gets the next move from the current player and
 * attempts to make the play.
 */
Game.prototype.playTurn = function (callback) {
  this.board.print();

  if (this.player === "human") {
    rlInterface.question(
      `${this.turn}, where do you want to move?`,
      handleResponse.bind(this)
    );
  } else {
    const pos = this.ai.getMove();
    if (!this.board.validMove(pos, this.turn)) {
      console.log("Invalid move!");
      this.playTurn(callback);
      return;
    }

    this.board.placePiece(pos, this.turn);
    console.log(`AI played ${pos}`);
    this._flipTurn();
    this._flipPlayer();
    callback();
  }

  function handleResponse(answer) {
    const pos = JSON.parse(answer);
    if (!this.board.validMove(pos, this.turn)) {
      console.log("Invalid move!");
      this.playTurn(callback);
      return;
    }

    this.board.placePiece(pos, this.turn);
    this._flipTurn();
    this._flipPlayer();
    callback();
  }
};

/**
 * Continues game play, switching turns, until the game is over.
 */
Game.prototype.runLoop = function (overCallback) {
  if (this.board.isOver()) {
    console.log("The game is over!");
    overCallback();
  } else if (!this.board.hasMove(this.turn)) {
    console.log(`${this.turn} has no move!`);
    this._flipTurn();
    this._flipPlayer();
    this.runLoop();
  } else {
    this.playTurn(this.runLoop.bind(this, overCallback));
  }
};

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  module.exports = Game;
}
// DON'T TOUCH THIS CODE
