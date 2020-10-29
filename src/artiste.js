module.exports = function makeArtiste({
  width,
  height,
  drawPixel,
  getInitialBuffer = () => null,
  onFinish = () => null,
}) {
  let buffer = getInitialBuffer();

  return {
    // `buffer` and `onFinish` might be in the wrong places? dunno
    // this design is a lil weird
    drawPixelShader(shader) {
      let t = +new Date();

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let rgb = shader(x, y, t, buffer) || [0, 0, 0];
          drawPixel(x, y, rgb);
        }
      }

      onFinish(buffer);
    },
  };
};
