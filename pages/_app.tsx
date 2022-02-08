import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo title="Visualizer" />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        storageKey="visualizer-mode"
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
