import { Box, MantineProvider } from "@mantine/core";
import Head from "next/head";
import Nav from "../components/Nav";
import { APP_TITLE } from "../constants/app.constants";
import theme from "../styles/mantine";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS {...theme}>
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "light"
                ? theme.colors.gray[1]
                : theme.colors.gray[9],
          })}>
          <Nav />
          <Component {...pageProps} />
        </Box>
      </MantineProvider>
    </>
  );
}
