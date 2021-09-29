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
  let validMoves = this.board.validMoves(this.color);

  for (let i=0; i < validMoves.length; i++) {
    if (this.isCornerMove(validMoves[i])) {
      return validMoves[i];
    }
  }

  let scoresMoves = validMoves.map(vm => {
    let board_copy = this.copyBoard(this.board)
    board_copy.placePiece(vm, this.color);
    let score = board_copy.score(this.color);
    return [score, vm];
  });

  scoresMoves.sort((a, b) => {
    return a[0] - b[0];
  })

  return scoresMoves[scoresMoves.length-1][1]
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
