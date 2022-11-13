import React from "react";
import styles from "../../styles/ListingPage.module.scss";
import { NextSeo } from "next-seo";
import {
  APP_TITLE,
  ISR_INTERVAL,
  SITE_URL,
} from "../../constants/app.constants";
import { storiesList } from "../../services/serverData.promises";
import ContentCardLarge from "../../components/contentCards/ContentCardLarge";

export default function StoriesList({ stories }) {
  return (
    <>
      <NextSeo
        title="Latest Stories"
        description={`Latest stories on ${APP_TITLE}`}
        openGraph={{
          type: "page",
          url: SITE_URL + "/stories",
        }}
      />
      <div className={styles["listing-page"]}>
        <div
          className={`container-fluid shadow ${styles["listing-page__header"]}`}>
          <div className="container px-0 text-center py-5">
            <h1 className="text-center">Latest Stories on</h1>
            <h1 className="display-3 text-primary">{APP_TITLE}</h1>
          </div>
        </div>
        <div className="container-fluid pt-4 pt-md-5 pb-3">
          <div className="container px-0">
            <div className="row">
              {stories.map((story) => (
                <div className="col-md-6 mb-3" key={story.slug}>
                  <ContentCardLarge data={story} variant="stories" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const response = await storiesList(25);
  const stories = response.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      stories,
    },
    revalidate: ISR_INTERVAL,
  };
}
