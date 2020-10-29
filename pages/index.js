import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import * as shaders from "../src/shaders";
import makeArtiste from "../src/artiste";
import binary from "../src/binary";

const FPS = 60;

// collatz stuff
let initialValue = binary.createBitString(32 * 32);
initialValue[200] = 1;
let currentValue = [...initialValue];

function useArtiste(canvas) {
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

            // collatz stuff :(
            if (binary.isOne(currentValue)) {
              binary.inc(initialValue);
              currentValue = [...initialValue];
            } else if (currentValue[0] === 0) {
              binary.halve(currentValue);
            } else {
              let n = [...currentValue];
              binary.double(currentValue);
              binary.addLeft(currentValue, n);
              binary.inc(currentValue);
            }
          },
        });

        art.drawPixelShader(shaders.collatz, currentValue);
      }

      setTime((time) => time + 1);
    }, 1000 / FPS);

    return () => clearTimeout(timer);
  }, [time]);
}

export default function Home() {
  let canvas = useRef(null);
  useArtiste(canvas);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>🎨</h1>
        <canvas ref={canvas} width="32" height="32" id="canvas"></canvas>
      </main>
    </div>
  );
}
