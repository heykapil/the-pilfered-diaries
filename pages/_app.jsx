import Head from "next/head";
import { Box, MantineProvider, ScrollArea } from "@mantine/core";
import { APP_TITLE } from "../constants/app.constants";
import Nav from "../components/Nav";
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
          <Box
            sx={{ flexGrow: 1 }}
            component={ScrollArea}
            style={{ height: "calc(100vh - 60px)" }}>
            <Component {...pageProps} />
          </Box>
        </Box>
      </MantineProvider>
    </>
  );
}
