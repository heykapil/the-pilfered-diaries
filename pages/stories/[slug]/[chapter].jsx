import CommentsList from "@components/CommentsList";
import Markdown from "@components/Markdown";
import { APP_TITLE, AVG_READING_SPEED } from "@constants/app";
import firestore from "@fb/server";
import {
  IconArrowLeft,
  IconArrowRight,
  IconHome,
  IconPoint,
} from "@tabler/icons";
import axios from "axios";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import readingTime from "reading-time";
import styles from "../../../styles/modules/SingleChapter.module.scss";

export default function SingleChapter({ metadata, content }) {
  const { query } = useRouter();
  return (
    <>
      <NextSeo
        title={metadata.title}
        description={metadata.excerpt}
        openGraph={{
          description: metadata.excerpt,
          type: "article",
          title: metadata.title,
          article: {
            publishedTime: metadata.published,
            tags: metadata.tags,
            authors: [metadata.author],
          },
        }}
      />
      <div className={`container-fluid ${styles["single-story"]}`}>
        <div className={`container px-0 ${styles["single-story__header"]}`}>
          <h1 className="display-3">{metadata.title}</h1>
          <p className="small text-warning mb-0">
            by {metadata.author}
            <span className="mx-2">
              <IconPoint size={12} />
            </span>
            {metadata.readTime.text} ({metadata.readTime.words} words)
          </p>
        </div>
        <div className="container px-1">
          <Markdown {...content} />
          <div className="row mb-3">
            <div className="col-6 px-0">
              {metadata.previousChapter && (
                <Link
                  className={styles["chapter-toggle"]}
                  href={`/stories/${query.slug}/${metadata.previousChapter}`}
                >
                  <IconArrowLeft size={24} />
                  Previous Chapter
                </Link>
              )}
            </div>
            <div className="col-6 px-0">
              <Link
                className={styles["chapter-toggle"]}
                href={
                  metadata.nextChapter
                    ? `/stories/${query.slug}/${metadata.nextChapter}`
                    : `/stories/${query.slug}`
                }
              >
                {metadata.nextChapter ? "Next Chapter" : "Story Home"}
                {metadata.nextChapter ? (
                  <IconArrowRight size={24} />
                ) : (
                  <IconHome size={20} />
                )}
              </Link>
            </div>
          </div>
        </div>
        {!metadata.nextChapter && (
          <>
            <div className="container my-2">
              <CommentsList target={query.slug} type="stories" fetchOnClient />
            </div>
            <div className="d-flex justify-content-center mb-3">
              <Link
                className="btn btn-outline-primary icon-right"
                href="/submissions"
              >
                Submit your work to {APP_TITLE}
                <IconArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/** @type {import('next').GetStaticPaths} */
export async function getStaticPaths() {
  const paths = (
    await firestore.collection("stories").where("draft", "==", false).get()
  ).docs.flatMap((doc) => {
    const chapterPaths = doc.data().chapterSlugs.map((chapter) => ({
      params: {
        slug: doc.id,
        chapter,
      },
    }));
    return chapterPaths;
  });

  return {
    paths,
    fallback: "blocking",
  };
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps(ctx) {
  const { params } = ctx;

  const chapterDoc = await firestore
    .doc(`stories/${params.slug}/chapters/${params.chapter}`)
    .get();
  const storyFile = await axios.get(chapterDoc.data().content);

  const { content: source } = grayMatter(storyFile.data);
  const time = readingTime(source, { wordsPerMinute: AVG_READING_SPEED });
  const content = await serialize(source);

  return {
    props: {
      metadata: { ...chapterDoc.data(), readTime: time },
      content,
    },
  };
}
