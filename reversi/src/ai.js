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

  for (let i=0; i < validMoves.length; i++) {
    if (this.isEdgeMove(validMoves[i])) {
      return validMoves[i];
    }
  }

  return validMoves[Math.floor(Math.random()*validMoves.length)]
}

AI.prototype.isCornerMove = function(pos) {
  return (pos[0] === 0 && pos[1] === 0) || (pos[0] === 0 && pos[1] === 7) || (pos[0] === 7 && pos[1] === 0) || (pos[0] === 7 && pos[1] === 7)
}

AI.prototype.isEdgeMove = function(pos) {
  return pos[0] === 0 || pos[0] === 7 || pos[1] === 0 || pos[1] === 7;
}

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  module.exports = AI;
}
// DON'T TOUCH THIS CODE
