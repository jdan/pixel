let { useState, useEffect } = require("react");
let shaders = require("./shaders");

const FPS = 60;

module.exports = function makeArtiste({ width, height, drawPixel, onFinish }) {
  return {
    drawPixelShader(shader) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let rgb = shader(x, y);
          drawPixel(x, y, rgb);
        }
      }

      onFinish();
    },
  };
};

exports.useArtiste = (canvas) => {
  let [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvas.current) {
        let ctx = canvas.current.getContext("2d");
        let imageData = ctx.createImageData(32, 32);

        let art = makeArtiste({
          width: 32,
          height: 32,
          drawPixel: (x, y, [r, g, b]) => {
            imageData.data[32 * 4 * y + x * 4] = r;
            imageData.data[32 * 4 * y + x * 4 + 1] = g;
            imageData.data[32 * 4 * y + x * 4 + 2] = b;
            imageData.data[32 * 4 * y + x * 4 + 3] = 255;
          },
          onFinish: () => {
            ctx.putImageData(imageData, 0, 0);
          },
        });

        art.drawPixelShader(shaders.mandel);
      }

      setTime((time) => time + 1);
    }, 1000 / FPS);

    return () => clearTimeout(timer);
  }, [time]);
};
