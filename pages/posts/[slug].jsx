import CommentsList from "@components/CommentsList";
import ContentCardLarge from "@components/ContentCardLarge";
import Markdown from "@components/Markdown";
import Share from "@components/Share";
import Subscribe from "@components/Subscribe";
import {
  APP_TITLE,
  AVG_READING_SPEED,
  DATE_FORMATS,
  ISR_INTERVAL,
} from "@constants/app";
import firestore from "@fb/server";
import { useIntersection } from "@hooks/intersection";
import { scrollToRef } from "@lib/utils";
import { commentsList, getRelatedPosts } from "@services/server";
import { IconArrowDown, IconArrowRight, IconPoint } from "@tabler/icons";
import axios from "axios";
import dayjs from "dayjs";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { lazy, Suspense, useRef, useState } from "react";
import readingTime from "reading-time";
import styles from "../../styles/modules/Post.module.scss";

const TextControl = lazy(() => import("../../components/TextControl"));
const TagsList = lazy(() => import("../../components/TagsList"));

export default function SinglePost({
  meta,
  content,
  comments = [],
  relatedPosts = [],
}) {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(18);
  const ref = useRef();
  const contentVisible = useIntersection(ref);

  // TODO: Create a loading component
  if (router.isFallback) return "Loading...";

  return (
    <>
      <NextSeo
        title={meta.title}
        description={meta.excerpt}
        openGraph={{
          description: meta.excerpt,
          type: "article",
          title: meta.title,
          article: {
            publishedTime: meta.published,
            tags: meta.tags,
            authors: [meta.author],
          },
          images: [
            {
              url: meta.cover,
              width: 1280,
              height: 720,
              alt: meta.slug + "-cover",
            },
          ],
        }}
      />
      <div className={styles.post}>
        <div
          className={`container-fluid shadow ${styles.post__header}`}
          style={{ backgroundImage: `url(${meta.cover})` }}
        >
          <h1 className="display-1">{meta.title}</h1>
          <p className="my-3">
            <span className="me-1">{meta.author}</span>
            <span className="mx-1 text-primary">
              <IconPoint size={16} />
            </span>
            <span className="mx-1">
              {meta.readTime.text} ({meta.readTime.words} words)
            </span>
            <span className="mx-1 text-primary">
              <IconPoint size={16} />
            </span>
            <span className="ms-1">
              {dayjs(meta.published).format(DATE_FORMATS.date)}
            </span>
          </p>
          <p className={styles["meta-excerpt"]}>{meta.excerpt}</p>
          <button
            className="icon-btn icon-btn__lg mt-3"
            data-bs-toggle="tooltip"
            data-bs-offset="0,5"
            data-bs-placement="bottom"
            title="Scroll To Content"
            onClick={() => scrollToRef(ref)}
          >
            <IconArrowDown size={36} />
          </button>
        </div>
        <Markdown ref={ref} theme="dark" fontSize={fontSize} {...content} />
        <div className="container">
          <div className="my-2">
            <Suspense fallback="...">
              <TagsList tags={meta.tags} />
            </Suspense>
          </div>
          <div className="mt-3">
            <Share title={meta.title} url={router.asPath} contentType="post" />
          </div>
          <CommentsList
            type="posts"
            title={meta.title}
            comments={comments}
            target={meta.slug}
          />
          <p className="h3 mb-1 text-primary">
            More Like this on {APP_TITLE}...
          </p>
          {relatedPosts.length > 0 ? (
            <div className="row mt-3">
              {relatedPosts.map((post) => (
                <div className="col-md-6 mb-3" key={post.slug}>
                  <ContentCardLarge data={post} variant="posts" />
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center my-3">
              <Link className="btn btn-primary" href="/posts">
                <span className="me-1">View All Posts</span>
                <IconArrowRight size={18} />
              </Link>
            </div>
          )}
          <div className="row mb-3 gap-3 gap-md-0">
            <div className="col-md-3 offset-md-3">
              <Subscribe compact />
            </div>
            <div className="col-md-3">
              <Link
                className="btn btn-outline-primary btn-sm w-100 icon-right"
                href="/submissions"
              >
                Submit work to {APP_TITLE}
                <IconArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {contentVisible && (
        <TextControl initialSize={18} onSizeChange={setFontSize} />
      )}
    </>
  );
}

/** @type {import('next').GetStaticPaths} */
export async function getStaticPaths() {
  const response = await firestore
    .collection("posts")
    .where("draft", "==", false)
    .get();
  const paths = response.docs.map((doc) => ({
    params: {
      slug: doc.id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps(ctx) {
  const { params } = ctx;
  const postRes = await firestore.doc(`posts/${params.slug}`).get();
  const commentsRes = await commentsList("posts", params.slug);
  const relatedPostsRes = await getRelatedPosts(
    params.slug,
    postRes.data().tags
  );
  const file = await axios.get(postRes.data().content);

  const { content } = grayMatter(file.data);

  const metadata = {
    ...postRes.data(),
    readTime: readingTime(content, { wordsPerMinute: AVG_READING_SPEED }),
    published: postRes.data().published.toDate().toISOString(),
    slug: params.slug,
  };
  delete metadata.content;

  return {
    props: {
      content: await serialize(content),
      meta: metadata,
      comments:
        commentsRes.docs.length > 0
          ? commentsRes.docs.map((doc) => ({
              ...doc.data(),
              date: doc.data().date.toDate().toISOString(),
              id: doc.id,
            }))
          : [],
      relatedPosts: relatedPostsRes.docs.map((doc) => {
        const obj = {
          ...doc.data(),
          slug: doc.id,
          published: doc.data().published.toDate().toISOString(),
        };
        delete obj.content;
        return obj;
      }),
    },
    revalidate: ISR_INTERVAL * 24 * 7, // revalidate every 1 week.
  };
}
