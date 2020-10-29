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
  25,
  // Mode
  "adafruit-hat-pwm"
);

let art = artiste({
  width: 32,
  height: 32,
  drawPixel: (x, y, rgb) => {
    // I installed the screen rotated 90 degrees
    matrix.setPixel(y, 32 - x, ...rgb);
  },
  onFinish: (buffer) => {
    for (let x = 0; x < 32; x++) {
      if (buffer.initialValue[x]) {
        matrix.setPixel(31, 31 - x, 0, 255, 0);
      }
    }

    matrix.update();
    shaders.collatz.onFinish(buffer);
  },
  getInitialBuffer: shaders.collatz.getInitialBuffer,
});

while (1) {
  art.drawPixelShader(shaders.collatz);
}
