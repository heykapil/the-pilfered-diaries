import firestore from "@fb/server";
import { getServerSideSitemap } from "next-sitemap";

/** @type {import('next').GetServerSideProps} */
export async function getServerSideProps(ctx) {
  const [postsRes, storiesRes] = await Promise.all([
    firestore
      .collection("posts")
      .where("draft", "==", false)
      .orderBy("published", "desc")
      .get(),
    firestore
      .collection("stories")
      .where("draft", "==", false)
      .orderBy("published", "desc")
      .get(),
  ]);

  const posts = postsRes.docs.map((post) => ({
    loc: `${process.env.SITE_URL}/posts/${post.id}`,
    lastmod: post.data().published.toDate().toISOString(),
  }));
  const stories = storiesRes.docs.map((story) => ({
    loc: `${process.env.SITE_URL}/stories/${story.id}`,
    lastmod: story.data().published.toDate().toISOString(),
  }));
  const chapters = storiesRes.docs.flatMap((doc) => {
    return doc.data().chapters.map((ch) => ({
      loc: `${process.env.SITE_URL}/stories/${doc.id}/${ch.id}`,
      lastmod: ch.published.toDate().toISOString(),
    }));
  });
  return getServerSideSitemap(ctx, [...posts, ...stories, ...chapters]);
}

export default function Sitemap() {}
