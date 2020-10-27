import Head from "next/head";
import { useRef } from "react";
import { useArtiste } from "../src/artiste";

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
