import React from "react";
import styles from "../../styles/ListingPage.module.scss";
import { NextSeo } from "next-seo";
import {
  APP_TITLE,
  ISR_INTERVAL,
  SITE_URL,
} from "../../constants/app.constants";
import { postsList } from "../../services/serverData.promises";
import ContentCardLarge from "../../components/contentCards/ContentCardLarge";

export default function PostsList({ posts }) {
  return (
    <>
      <NextSeo
        title="Latest Posts"
        description={`Latest posts on ${APP_TITLE}`}
        openGraph={{
          type: "page",
          url: SITE_URL + "/posts",
        }}
      />
      <div className={styles["listing-page"]}>
        <div
          className={`container-fluid shadow ${styles["listing-page__header"]}`}>
          <div className="container px-0 text-center py-5">
            <h1 className="text-center">Latest Posts on</h1>
            <h1 className="display-3 text-primary">{APP_TITLE}</h1>
          </div>
        </div>
        <div className="container-fluid pt-4 pt-md-5 pb-3">
          <div className="container px-0">
            <div className="row">
              {posts.map((post) => (
                <div className="col-md-6 mb-3" key={post.slug}>
                  <ContentCardLarge data={post} variant="posts" />
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
  const response = await postsList("all", 25);
  const posts = response.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      posts,
    },
    revalidate: ISR_INTERVAL,
  };
}
