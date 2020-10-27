import { useState, useEffect } from "react";

const FPS = 60;

const dot = (x, y) => {
  let t = new Date() / 1000;
  return x === Math.floor(Math.sin(t * 2) * 16 + 16) &&
    y === Math.floor(Math.cos(t * 2) * 16 + 16)
    ? [255, 255, 255]
    : [0, 0, 0];
};

const gradient = (x, y) => {
  return [Math.floor((255 * x) / 32), 0, Math.floor((255 * y) / 32)];
};

let shader = gradient;

export function useArtiste(canvas) {
  let [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvas.current) {
        let ctx = canvas.current.getContext("2d");

        let imageData = ctx.createImageData(32, 32);
        for (let x = 0; x < 32; x++) {
          for (let y = 0; y < 32; y++) {
            let [r, g, b] = shader(x, y);

            // artiste should take an x, y, r, g, and b and either
            // - matrix.setPixel()
            // - imageData.data[...] = ...

            imageData.data[32 * 4 * y + x * 4] = r;
            imageData.data[32 * 4 * y + x * 4 + 1] = g;
            imageData.data[32 * 4 * y + x * 4 + 2] = b;
            imageData.data[32 * 4 * y + x * 4 + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      setTime((time) => time + 1);
    }, 1000 / FPS);

    return () => clearTimeout(timer);
  }, [time]);
}
