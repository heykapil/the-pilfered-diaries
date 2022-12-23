import ContentCardLarge from "@components/ContentCardLarge";
import { APP_TITLE, ISR_INTERVAL, SITE_URL } from "@constants/app";
import { storiesList } from "@services/server";
import { NextSeo } from "next-seo";
import React from "react";
import styles from "../../styles/modules/ListingPage.module.scss";

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
      <div className={styles.listing}>
        <div className={`container-fluid shadow ${styles.listing__header}`}>
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

// TODO: This will be a client fetch, we'll not use server rendering here.
/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const response = await storiesList(25);
  const stories = response.docs.map((doc) => {
    const obj = {
      ...doc.data(),
      slug: doc.id,
      published: doc.data().published.toDate().toISOString(),
      lastUpdated: doc.data().lastUpdated.toDate().toISOString(),
    };
    delete obj.content;
    return obj;
  });

  return {
    props: {
      stories,
    },
    revalidate: ISR_INTERVAL,
  };
}
