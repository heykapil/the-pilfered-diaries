import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { NotificationsProvider } from "@context/Notification";
import { firebaseApp } from "@fb/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import "../styles/globals.scss";
import Subscribe from "@components/Subscribe";
import { SubscriptionProvider } from "@context/Subscription";

function MyApp({ Component, pageProps }) {
  const { pathname, asPath } = useRouter();
  useEffect(() => {
    const { Tooltip } = require("bootstrap");
    const tooltips = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
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

  useEffect(() => {
    const analytics = getAnalytics(firebaseApp);
    logEvent(analytics, "page_view");
  }, [asPath]);

  return (
    <NotificationsProvider>
      <SubscriptionProvider>
        <Navbar />
        <main className="page-content">
          <Component {...pageProps} />
        </main>
        <Footer />
      </SubscriptionProvider>
    </NotificationsProvider>
  );
}

export default MyApp;
