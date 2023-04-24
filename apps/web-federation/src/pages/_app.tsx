import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="flex min-h-screen justify-center bg-gray-800">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
