import { IconArrowDown, IconPoint } from "@tabler/icons";
import axios from "axios";
import dayjs from "dayjs";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";
import readingTime from "reading-time";
import RenderMarkdown from "../../components/markdown/RenderMarkdown";
import {
  AVG_READING_SPEED,
  DATE_FORMATS,
  ISR_INTERVAL,
} from "../../constants/app.constants";
import firestore from "../../firebase/config";
import styles from "../../styles/SinglePost.module.scss";
import { scrollToContent } from "../../utils/utils";
import CommentsList from "../../components/commentsList/CommentsList";

export default function SinglePost({ meta, content, comments }) {
  const router = useRouter();
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
      <div className={styles["single-post"]}>
        <div
          className={`container-fluid shadow ${styles["single-post__header"]}`}
          style={{ backgroundImage: `url(${meta.cover})` }}>
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
            onClick={() => scrollToContent("contentBlock")}>
            <IconArrowDown size={36} />
          </button>
        </div>
        <div className="container my-4 py-3" id="contentBlock">
          <RenderMarkdown {...content} />
          <CommentsList
            type="posts"
            title={meta.title}
            comments={comments}
            target={meta.slug}
          />
        </div>
      </div>
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
  const response = await firestore.doc(`posts/${params.slug}`).get();
  const commentsRes = await firestore
    .collection("comments")
    .orderBy("date", "desc")
    .where("type", "==", "posts")
    .where("target", "==", params.slug)
    .where("approved", "==", true)
    .get();

  const file = await axios.get(response.data().content);
  const { content } = grayMatter(file.data);

  return {
    props: {
      content: await serialize(content),
      meta: {
        ...response.data(),
        readTime: readingTime(content, { wordsPerMinute: AVG_READING_SPEED }),
        published: response.data().published.toDate().toISOString(),
        slug: params.slug,
      },
      comments:
        commentsRes.docs.length > 0
          ? commentsRes.docs.map((doc) => ({
              ...doc.data(),
              date: doc.data().date.toDate().toISOString(),
              id: doc.id,
            }))
          : [],
    },
    revalidate: ISR_INTERVAL,
  };
}
