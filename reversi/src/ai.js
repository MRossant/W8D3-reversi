function AI(color, board) {
  this.color = color
  this.board = board;
}

AI.prototype.getMove = function() {
  let validMoves = this.board.validMoves(this.color);

  return validMoves[Math.floor(Math.random()*validMoves.length)]
}

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  module.exports = AI;
}
// DON'T TOUCH THIS CODE
