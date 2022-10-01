import { getServerSideSitemap } from "next-sitemap";
import firestore from "../../firebase/config";

/** @type {import('next').GetServerSideProps} */
export async function getServerSideProps(ctx) {
  const postsRes = await firestore
    .collection("posts")
    .where("draft", "==", false)
    .orderBy("published", "desc")
    .get();

  const storiesRes = await firestore
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("published", "desc")
    .get();

  const posts = postsRes.docs.map((post) => ({
    loc: `${process.env.SITE_URL}/posts/${post.id}`,
    lastmod: post.data().published.toDate().toISOString(),
  }));
  const stories = storiesRes.docs.map((story) => ({
    loc: `${process.env.SITE_URL}/stories/${story.id}`,
    lastmod: story.data().published.toDate().toISOString(),
  }));

  return getServerSideSitemap(ctx, [...posts, ...stories]);
}

export default function Sitemap() {}
