import About from "@components/home/About";
import GuestPosts from "@components/home/GuestPosts";
import Header from "@components/home/Header";
import PostsList from "@components/home/PostsList";
import StoriesCarousel from "@components/home/StoriesCarousel";
import { APP_TITLE, ISR_INTERVAL, SITE_URL } from "@constants/app";
import firestore from "@fb/server";
import { postsList, storiesList } from "@services/server";
import { NextSeo } from "next-seo";
import styles from "../styles/modules/Home.module.scss";

export default function Home({ stories, posts, guestPosts, siteCover }) {
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
      <div className={styles.home}>
        <Header siteCover={siteCover} />
        <About />
        <div className="container-fluid py-2">
          <div className="container px-0 mt-4">
            <div className="row">
              <div className="col-md-7 mb-3 mb-md-0">
                <StoriesCarousel stories={stories} />
              </div>
              <div className="col-md-5">
                <PostsList posts={posts} />
              </div>
            </div>
          </div>
        </div>
        <GuestPosts posts={guestPosts} />
      </div>
    </>
  );
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const [storiesRes, postsRes, guestPostsRes] = await Promise.all([
    storiesList(5),
    postsList("owned", 5),
    postsList("guest", 5),
  ]);

  const headerId = (
    await firestore.doc("siteContent/site-config").get()
  ).data();
  const siteCover = (
    await firestore
      .doc(`siteContent/site-config/headers/${headerId.headerImg}`)
      .get()
  ).data();

  const stories = storiesRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
    lastUpdated: doc.data().lastUpdated.toDate().toISOString(),
  }));

  const posts = postsRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));
  const guestPosts = guestPostsRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      stories,
      posts,
      guestPosts,
      siteCover,
    },
    revalidate: ISR_INTERVAL,
  };
}
