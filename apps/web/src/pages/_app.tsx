import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withWunderGraph } from "generated-wundergraph/nextjs";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withWunderGraph(MyApp);
