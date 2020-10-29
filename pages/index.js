import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import * as shaders from "../src/shaders";
import makeArtiste from "../src/artiste";

const FPS = 60;

function useArtiste(canvas, shader) {
  let [time, setTime] = useState(0);
  let art = useRef(null);

  useEffect(() => {
    if (canvas.current) {
      let ctx = canvas.current.getContext("2d");
      let imageData = ctx.createImageData(32, 32);

      art.current = makeArtiste({
        width: 32,
        height: 32,
        getInitialBuffer: shader.getInitialBuffer,
        drawPixel: (x, y, [r, g, b]) => {
          imageData.data[32 * 4 * y + x * 4] = r;
          imageData.data[32 * 4 * y + x * 4 + 1] = g;
          imageData.data[32 * 4 * y + x * 4 + 2] = b;
          imageData.data[32 * 4 * y + x * 4 + 3] = 255;
        },
        onFinish: (buffer) => {
          ctx.putImageData(imageData, 0, 0);
          shader.onFinish && shader.onFinish(buffer);
        },
      });
    }
  }, [canvas, shader]);

  useEffect(() => {
    const timer = setTimeout(() => {
      art.current.drawPixelShader(shader);
      setTime((time) => time + 1);
    }, 1000 / FPS);

    return () => clearTimeout(timer);
  }, [art, time]);
}

export default function Home() {
  let canvas = useRef(null);
  useArtiste(canvas, shaders.collatz);

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
