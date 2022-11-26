import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="shortcut icon"
            href="/tpd-logo-w.svg"
            type="image/svg+xml"
            media="(prefers-color-scheme: dark)"
          />
          <link
            rel="shortcut icon"
            href="/tpd-logo-b.svg"
            type="image/svg+xml"
            media="(prefers-color-scheme: light)"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Belleza&family=Crimson+Pro:ital,wght@0,200;0,400;0,600;0,700;0,800;1,200;1,400;1,600;1,700;1,800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
