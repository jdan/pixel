import artiste from "src/artiste";
import * as shaders from "src/shaders";

const LedMatrix = require("easybotics-rpi-rgb-led-matrix");
const matrix = new LedMatrix(
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

const art = artiste({
  width: 32,
  height: 32,
  drawPixel: (x, y, rgb) => {
    matrix.setPixel(x, y, ...rgb);
  },
  onFinish: () => matrix.update(),
});

while (1) {
  art.drawPixelShader(shaders.mandel);
}
