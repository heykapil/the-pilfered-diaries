import { Box, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { NextSeo } from "next-seo";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { APP_TITLE, SITE_URL } from "../constants/app.constants";
import theme from "../styles/mantine";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextSeo
        defaultTitle={APP_TITLE}
        titleTemplate={`%s | ${APP_TITLE}`}
        openGraph={{
          type: "website",
          locale: "en_IN",
          url: SITE_URL,
          title: APP_TITLE,
          site_name: APP_TITLE,
          description:
            "The Pilfered Diaries is a place where I pen down the thoughts that come to my mind from all around me. I turn them to stories, sometimes little thoughts, and sometimes just a mess of words.",
        }}
        additionalMetaTags={[
          {
            name: "viewport",
            content: "minimum-scale=1, initial-scale=1, width=device-width",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.svg",
          },
        ]}
      />
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <NotificationsProvider position="top-center" autoClose={3000}>
          <Box sx={{ minHeight: "100vh" }}>
            <Nav />
            <Box sx={{ minHeight: "calc(100vh - 130px)" }}>
              <Component {...pageProps} />
            </Box>
            <Footer />
          </Box>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}
