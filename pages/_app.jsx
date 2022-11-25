import "../styles/globals.scss";
import Navbar from "@components/Navbar";
import { useEffect } from "react";
import { NotificationsProvider } from "@context/Notification";
import { useRouter } from "next/router";
import Footer from "@components/Footer";

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  useEffect(() => {
    const { Tooltip } = require("bootstrap");
    const tooltips = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"')
    );
    tooltips.map(function (trigger) {
      return new Tooltip(trigger);
    });
    return () => {
      document.querySelectorAll(".tooltip.show").forEach((node) => {
        node.remove();
      });
    };
  }, [pathname]);

  return (
    <NotificationsProvider>
      <Navbar />
      <main className="page-content">
        <Component {...pageProps} />
      </main>
      <Footer />
    </NotificationsProvider>
  );
}

export default MyApp;
