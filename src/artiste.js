import { useState, useEffect } from "react";

const FPS = 30;

const shader = (x, y) => {
  let t = new Date() / 1000;
  return 2 > Math.abs(x - Math.floor(Math.sin(t) * 16 + 16)) &&
    2 > Math.abs(y - Math.floor(Math.cos(t) * 16 + 16))
    ? [255, 255, 255]
    : [0, 0, 0];
};

export function useArtiste() {
  let pixels = Array.from({ length: 32 * 32 });
  let [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = document.getElementById("canvas").getContext("2d");

      for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
          let rgb = shader(x, y);
          pixels[32 * y + x] = rgb;
          ctx.fillStyle = `rgb(${rgb.join(", ")})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      setTime((time) => time + 1);
    }, 1000 / FPS);

    return () => clearTimeout(timer);
  }, [time]);
}
