import { Box, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
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
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <NotificationsProvider position="top-center" autoClose={3000}>
          <Box
            sx={(theme) => ({
              minHeight: "100vh",
              backgroundColor:
                theme.colorScheme === "light"
                  ? theme.colors.gray[1]
                  : theme.colors.gray[9],
            })}>
            <Nav />
            <Component {...pageProps} />
          </Box>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}
