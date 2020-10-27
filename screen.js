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
  75,
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
  onFinish: () => matrix.update(),
});
art.drawPixelShader(shaders.mandel);

while (1) {}
