let { Chess } = require("chess.js");
let shaders = require("./shaders");

// these look good on web but not screen
// let BLACK = [0, 0, 0];
// let WHITE = [255, 255, 255];
// let DARK = [97, 101, 143];
// let LIGHT = [182, 185, 212];

let BLACK = [50, 60, 188];
let WHITE = [255, 255, 255];
let DARK = [0, 0, 0];
let LIGHT = [10, 10, 10];

let palette = [BLACK, WHITE, DARK, LIGHT];

let makePiece = (pattern) => (col) => pattern.replace(/X/g, col).split("\n");
let pieces = {
  p: makePiece("    \n    \n XX "),
  r: makePiece("XXXX\n XX \n XX "),
  n: makePiece(" XX \nXXX \n XXX"),
  b: makePiece(" XX \n XX \nXXXX"),
  q: makePiece("XXXX\n XX \nXXXX"),
  k: makePiece("    \n XX \n XX \n    "),
};

exports.chess = (fen) => {
  let result = (x, y) =>
    x % 8 < 4 ? (y % 8 < 4 ? LIGHT : DARK) : y % 8 < 4 ? DARK : LIGHT;

  let game = new Chess(fen);
  // why can't I do `new Chess` with next.js?
  let board = [
    [
      { type: "r", color: "b" },
      { type: "n", color: "b" },
      { type: "b", color: "b" },
      { type: "q", color: "b" },
      { type: "k", color: "b" },
      { type: "b", color: "b" },
      { type: "n", color: "b" },
      { type: "r", color: "b" },
    ],
    [
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
      { type: "p", color: "b" },
    ],
    [],
    [],
    [],
    [],
    [
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
      { type: "p", color: "w" },
    ],
    [
      { type: "r", color: "w" },
      { type: "n", color: "w" },
      { type: "b", color: "w" },
      { type: "q", color: "w" },
      { type: "k", color: "w" },
      { type: "b", color: "w" },
      { type: "n", color: "w" },
      { type: "r", color: "w" },
    ],
  ];

  board = game.board();

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      let square = board[row][col];

      if (!square) {
        continue;
      }

      // Upate the shader
      result = shaders.combineShaders({
        bottom: result,
        top: shaders.translateShader({
          shader: shaders.makeSpriteShader({
            pattern: pieces[square.type](square.color === "b" ? 0 : 1),
            colors: palette,
          }),
          y: row * 4,
          x: col * 4,
        }),
      });
    }
  }

  return result;
};
