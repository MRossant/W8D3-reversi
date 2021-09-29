function AI(board) {
  this.board = board;
}

AI.prototype.getMove = function() {

  return [2,4];
}

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  module.exports = AI;
}
// DON'T TOUCH THIS CODE
