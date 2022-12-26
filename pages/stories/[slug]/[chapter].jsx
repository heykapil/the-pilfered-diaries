import CommentsList from "@components/CommentsList";
import Markdown from "@components/Markdown";
import Share from "@components/Share";
import { APP_TITLE, AVG_READING_SPEED } from "@constants/app";
import firestore from "@fb/server";
import { useIntersection } from "@hooks/intersection";
import { commentsList } from "@services/server";
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

export default function SingleChapter({ story, chapter, content, comments }) {
  const { query, asPath } = useRouter();

  const [fontSize, setFontSize] = useState(18);
  const ref = useRef();
  const contentVisible = useIntersection(ref);

  return (
    <>
      <NextSeo
        title={chapter.title}
        description={chapter.excerpt}
        openGraph={{
          description: chapter.excerpt,
          type: "article",
          title: chapter.title,
          article: {
            publishedTime: chapter.published,
            tags: chapter.tags,
            authors: [chapter.author],
          },
        }}
      />
      <div className={`container-fluid px-0 ${styles.chapter}`}>
        <div
          className={`container-fluid ${styles.chapter__header}`}
          style={{ backgroundImage: `url(${story.cover})` }}
        >
          <h1 className="display-3">{chapter.title}</h1>
          <p className="small text-warning mb-0">
            by {chapter.author}
            <span className="mx-2">
              <IconPoint size={12} />
            </span>
            {chapter.readTime.text} ({chapter.readTime.words} words)
          </p>
        </div>
        <Markdown {...content} ref={ref} theme="dark" fontSize={fontSize} />
        <div className="container">
          <div className="row mb-3 mx-0">
            {chapter.previousChapter && (
              <div className="col-6 ps-0 pe-1">
                <Link
                  className={styles.navigation}
                  href={`/stories/${query.slug}/${chapter.previousChapter}`}
                >
                  <IconArrowLeft size={24} />
                  Prev. Chapter
                </Link>
              </div>
            )}
            <div className="col-6 pe-0 ps-1">
              {chapter.nextChapter ? (
                <Link
                  className={styles.navigation}
                  href={`/stories/${query.slug}/${chapter.nextChapter}`}
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
            title={chapter.title}
            url={asPath}
            contentType="story-chapter"
          />
        </div>
        <div className="container my-2">
          <CommentsList
            type="stories"
            title={story.title}
            comments={comments}
            target={query.slug}
          />
        </div>
        {!chapter.nextChapter && (
          <div className="d-flex justify-content-center mb-3">
            <Link
              className="btn btn-outline-primary icon-right"
              href="/submissions"
            >
              Submit your work to {APP_TITLE}
              <IconArrowRight size={18} />
            </Link>
          </div>
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
    const chapterPaths = doc.data().chapters.map((chapter) => ({
      params: {
        slug: doc.id,
        chapter: chapter.id,
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

  const story = await firestore.doc(`stories/${params.slug}`).get();
  const chapters = story.data().chapters;
  const chapterIndex = chapters.findIndex((ch) => ch.id === params.chapter);
  const file = await axios.get(chapters[chapterIndex].content);

  // Retrieve comments on the latest chapter only.
  let comments = [];
  if (chapterIndex === chapters.length - 1) {
    const commentsRes = await commentsList("stories", params.slug);
    comments = commentsRes.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date.toDate().toISOString(),
    }));
  }

  const { content: source } = grayMatter(file.data);
  const time = readingTime(source, { wordsPerMinute: AVG_READING_SPEED });
  const content = await serialize(source);

  const chapter = {
    ...chapters[chapterIndex],
    readTime: time,
    published: chapters[chapterIndex].published.toDate().toISOString(),
  };
  delete chapter.content;

  return {
    props: {
      chapter,
      content,
      story: { title: story.data().title, cover: story.data().cover },
      comments,
    },
  };
}
