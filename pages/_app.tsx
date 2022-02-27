import "../styles/globals.scss";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { IconContext } from "@react-icons/all-files/lib";
import Layout from "components/Layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="Visualizer"
        description="Sorting, pathfinding algorithm visualizer."
        openGraph={{
          type: "website",
          url: "https://visualizer-iota.vercel.app/",
          title: "Visualizer",
          description: "Sorting, pathfinding algorithm visualizer.",
          images: [
            {
              url: "https://res.cloudinary.com/flare-community/image/upload/v1645961912/static/visualizer_bhwskm.png",
              width: 632,
              height: 632,
              alt: "visualizer logo",
            },
          ],
        }}
      />
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
