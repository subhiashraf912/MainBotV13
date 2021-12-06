import NextProgress from "nextjs-progressbar";
import "../styles/globals.css";
import "../styles/header.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextProgress />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
