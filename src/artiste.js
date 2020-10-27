module.exports = function makeArtiste({ width, height, drawPixel, onFinish }) {
  return {
    drawPixelShader(shader) {
      let t = new Date();

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let rgb = shader(x, y, t);
          drawPixel(x, y, rgb);
        }
      }

      onFinish();
    },
  };
};
