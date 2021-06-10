let https = require("https");
let artiste = require("./src/artiste");
let shaders = require("./src/shaders");

let LedMatrix = require("easybotics-rpi-rgb-led-matrix");
let matrix = new LedMatrix(
  // Width, height
  32,
  32,
  // Panels
  1,
  1,
  // Brightness
  // For a lot of modes, 25 brightness is plenty
  25,
  // Mode
  "adafruit-hat-pwm"
);

let art = artiste({
  width: 32,
  height: 32,
  drawPixel: (x, y, rgb) => {
    // I installed the screen rotated 90 degrees
    // WHEN HANGING
    matrix.setPixel(y, 31 - x, ...rgb);

    // WHEN CORD OUT OF LEFT SIDE (on desk)
    // matrix.setPixel(31 - x, 31 - y, ...rgb);
  },
  onFinish: (buffer) => {
    // for (let x = 0; x < 32; x++) {
    //   if (buffer.initialValue[x]) {
    //     //matrix.setPixel(31, 31 - x, 0, 255, 0);
    //   }
    // }

    matrix.update();
    //shaders.collatz.onFinish(buffer);
  },
  //getInitialBuffer: shaders.collatz.getInitialBuffer,
});

// blank board: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function getLatestGames() {
  https
    .request(
      {
        host: "lichess.org",
        path: "/tv/feed",
      },
      (res) => {
        res.on("data", (chunk) => {
          let data = chunk.toString();
          try {
            fen = JSON.parse(data).d.fen + " KQkq - 0 1";
            console.log(fen);
          } catch (e) {
            console.error("Couldn't parse", data);
          }
        });
        res.on("end", (chunk) => {
          console.error(`Restarting at ${new Date()}`);
          getLatestGames();
        });
      }
    )
    .end();
}

// sometimes while(1)
function loop() {
  art.drawPixelShader(shaders.chess(fen));
  setTimeout(loop, 100);
}
getLatestGames();
loop();
