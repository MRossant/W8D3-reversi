// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = Array.from(
    { length: 8 },
    () => Array.from({ length: 8 })
  );

  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board (grid) {
  if (grid) {
    this.grid = grid;
  } else {
    this.grid = _makeGrid();
  }
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if ( x < 0 || x > 7 || y < 0 || y > 7) {
    return false;
  } else {
    return true;
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    return this.grid[pos[0]][pos[1]];
  } else {
    throw new Error("Not valid pos!");
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.grid[pos[0]][pos[1]] === undefined) {
    return false;
  } else if (this.grid[pos[0]][pos[1]].color === color) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.grid[pos[0]][pos[1]] !== undefined
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip=[]){
  return this._positionsToFlipRecurse([pos[0]+dir[0], pos[1]+dir[1]], color, dir, piecesToFlip)
};

Board.prototype._positionsToFlipRecurse = function(pos, color, dir, piecesToFlip=[]){
  if (!this.isValidPos(pos)) {
    return [];
  } else if (!this.isOccupied(pos)) {
    return [];
  } else if (this.isMine(pos, color)) {
    return piecesToFlip;
  }
  piecesToFlip.push(pos)
  return this._positionsToFlipRecurse([pos[0]+dir[0], pos[1]+dir[1]], color, dir, piecesToFlip)
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (!this.isValidPos(pos) || this.isOccupied(pos)) {
    return false;
  }

  return Board.DIRS.some(dir => {
    let array = this._positionsToFlip(pos, color, dir)
    return array.length > 0;
  })
};


/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (this.validMove(pos, color)) {
    this.grid[pos[0]][pos[1]] = new Piece(color);
    Board.DIRS.forEach(dir => {
      let positions = this._positionsToFlip(pos, color, dir);
      positions.forEach(pos => {
        this.grid[pos[0]][pos[1]].flip();
      })
    })
  } else {
    throw new Error("Invalid move!");
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validMovesArray = [];
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid.length; j++) {
      if (this.validMove([i, j], color)) {
        validMovesArray.push([i, j]);
      }
    }
  }

  return validMovesArray;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove("black") && !this.hasMove("white");
};

Board.prototype.score = function(color) {
  let count = 0;
  let otherCount = 0;

  for (let i=0; i < this.grid.length; i++) {
    for (let j=0; j < this.grid.length; j++) {
      if (this.isMine([i,j], color)) {
        count++;
      } else if (this.isOccupied([i,j])) {
        otherCount++;
      }
    }
  }
  return count - otherCount;
}


/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {

  console.log(" " + [0,1,2,3,4,5,6,7].join(" "));
  this.grid.forEach((row, i) => {
    let printRow = row.map(ele => {
      if (ele) {
        return ele;
      } else {
        return "-";
      }
    })
    console.log(`${i}` + printRow.join(" "));
  })
};

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE
