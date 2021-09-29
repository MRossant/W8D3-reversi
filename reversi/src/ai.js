const Board = require('./board');
const Piece = require('./piece');

function AI(color, board) {
  this.color = color
  this.board = board;
}

AI.prototype.getMoveOLD = function() {
  let validMoves = this.board.validMoves(this.color);

  return validMoves[Math.floor(Math.random()*validMoves.length)]
}

AI.prototype.getMove = function() {
  // for (let i=0; i < validMoves.length; i++) {
  //   if (this.isCornerMove(validMoves[i])) {
  //     return validMoves[i];
  //   }
  // }
  let validMoves = this.board.validMoves(this.color);

  let scoresMoves = validMoves.map(vm => {
    let board_copy = this.copyBoard(this.board)
    let score = this.getScores(board_copy, vm, 2, this.color)
    return [score, vm];
  });

  scoresMoves.sort((a, b) => {
    return a[0] - b[0];
  })
  return scoresMoves[scoresMoves.length-1][1]
}

AI.prototype.getScores = function(board, move, depth, color) {
  if (depth === 0) {
    board.placePiece(move, color);
    return board.score(this.color);
  }

  board.placePiece(move, color);
  let nextColor = color === "white" ? "black" : "white"
  let validMoves = board.validMoves(nextColor);

  let scoresMoves = validMoves.map(vm => {
    let board_copy = this.copyBoard(board)
    let score = this.getScores(board_copy, vm, depth-1, nextColor)
    return [score, vm];
  });

  scoresMoves.sort((a, b) => {
    return a[0] - b[0];
  })

  if (nextColor === this.color) {
    return scoresMoves[scoresMoves.length-1][0]
  } else {
    return scoresMoves[0][0]
  }
}

AI.prototype.isCornerMove = function(pos) {
  return (pos[0] === 0 && pos[1] === 0) || (pos[0] === 0 && pos[1] === 7) || (pos[0] === 7 && pos[1] === 0) || (pos[0] === 7 && pos[1] === 7)
}

AI.prototype.isEdgeMove = function(pos) {
  return pos[0] === 0 || pos[0] === 7 || pos[1] === 0 || pos[1] === 7;
}

AI.prototype.copyBoard = function(board) {
  let grid_copy = JSON.parse(JSON.stringify(board.grid));
  for (let i=0; i < grid_copy.length; i++) {
    for (let j=0; j < grid_copy.length; j++) {
      if (grid_copy[i][j] === null) {
        grid_copy[i][j] = undefined
      } else {
        grid_copy[i][j] = new Piece(grid_copy[i][j].color)
      }
    }
  }
  return new Board(grid_copy);
}

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  module.exports = AI;
}
// DON'T TOUCH THIS CODE
