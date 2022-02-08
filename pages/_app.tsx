import "../styles/globals.scss";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { IconContext } from "@react-icons/all-files/lib";
import Layout from "components/Layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo title="Visualizer" />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        storageKey="visualizer-mode"
      >
        <IconContext.Provider value={{ className: "r-icon" }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </IconContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
