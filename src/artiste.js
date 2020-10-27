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

const mandel = (x, y) => {
  let t = new Date() / 1000;

  // a + bi
  let a = (x / 32) * 3.5 - 2.35;
  let b = (y / 32) * 3.5 - 1.75;

  let a0 = a;
  let b0 = b;

  let h = 0;
  const MAX = 20;
  for (let i = 0; i < MAX; i++) {
    let a_ = a * a - b * b;
    let b_ = 2 * a * b;

    a = a_ + a0;
    b = b_ + b0;

    if (Math.sqrt(a * a + b * b) > 4) {
      break;
    }

    h += 1;
  }

  let c = Math.floor(Math.sqrt(h / MAX) * 255);
  return [c, c, c];
};

let shader = mandel;

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
