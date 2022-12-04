import Markdown from "@components/Markdown";
import Share from "@components/Share";
import { APP_TITLE, AVG_READING_SPEED } from "@constants/app";
import firestore from "@fb/server";
import { useIntersection } from "@hooks/intersection";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronLeft,
  IconPoint,
} from "@tabler/icons";
import axios from "axios";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import readingTime from "reading-time";
import styles from "../../../styles/modules/Chapter.module.scss";

const TextControl = dynamic(() => import("../../../components/TextControl"));
const CommentsList = dynamic(() => import("../../../components/CommentsList"));

export default function SingleChapter({ metadata, content }) {
  const { query, asPath } = useRouter();

  const [fontSize, setFontSize] = useState(18);
  const ref = useRef();
  const contentVisible = useIntersection(ref);

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
      <div className={`container-fluid px-0 ${styles.chapter}`}>
        <div className={`container px-0 ${styles.chapter__header}`}>
          <h1 className="display-3">{metadata.title}</h1>
          <p className="small text-warning mb-0">
            by {metadata.author}
            <span className="mx-2">
              <IconPoint size={12} />
            </span>
            {metadata.readTime.text} ({metadata.readTime.words} words)
          </p>
        </div>
        <Markdown {...content} ref={ref} theme="dark" fontSize={fontSize} />
        <div className="container">
          <div className="row mb-3 mx-0">
            {metadata.previousChapter && (
              <div className="col-6 ps-0 pe-1">
                <Link
                  className={styles.navigation}
                  href={`/stories/${query.slug}/${metadata.previousChapter}`}
                >
                  <IconArrowLeft size={24} />
                  Prev. Chapter
                </Link>
              </div>
            )}
            <div className="col-6 pe-0 ps-1">
              {metadata.nextChapter ? (
                <Link
                  className={styles.navigation}
                  href={`/stories/${query.slug}/${metadata.nextChapter}`}
                >
                  Next Chapter
                  <span className="ms-1">
                    <IconArrowRight size={24} />
                  </span>
                </Link>
              ) : (
                <Link
                  className={styles.navigation}
                  href={`/stories/${query.slug}`}
                >
                  <span className="me-1">
                    <IconChevronLeft size={24} />
                  </span>
                  Story Home
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="my-3 container">
          <Share
            title={metadata.title}
            url={asPath}
            contentType="story-chapter"
          />
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
      {contentVisible && (
        <TextControl initialSize={18} onSizeChange={setFontSize} />
      )}
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

  const metadata = { ...chapterDoc.data(), readTime: time };
  delete metadata.content;

  return {
    props: {
      metadata,
      content,
    },
  };
}
