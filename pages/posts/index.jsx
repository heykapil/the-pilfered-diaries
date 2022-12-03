import ContentCardLarge from "@components/ContentCardLarge";
import { APP_TITLE, ISR_INTERVAL, SITE_URL } from "@constants/app";
import { postsList } from "@services/server";
import { NextSeo } from "next-seo";
import React from "react";
import styles from "../../styles/modules/ListingPage.module.scss";

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
      <div className={styles.listing}>
        <div className={`container-fluid shadow ${styles.listing__header}`}>
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
  const posts = response.docs.map((doc) => {
    const obj = {
      ...doc.data(),
      slug: doc.id,
      published: doc.data().published.toDate().toISOString(),
    };
    delete obj.content;
    return obj;
  });

  return {
    props: {
      posts,
    },
    revalidate: ISR_INTERVAL,
  };
}
