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
  onFinish: () => matrix.update(),
});

while (1) {
  art.drawPixelShader(
    shaders.makeGradientShader({
      from: [93, 59, 96],
      to: [63, 87, 77],
      angle: -Math.PI / 6,
    })
  );
}
