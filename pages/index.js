import Head from "next/head";
import { useArtiste } from "../src/artiste";

export default function Home() {
  useArtiste();

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hello, world!</h1>
        <canvas width="32" height="32" id="canvas"></canvas>
      </main>
    </div>
  );
}
