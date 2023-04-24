import "@/styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={"goerli"}>
      <Head>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
