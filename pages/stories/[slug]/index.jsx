import CommentsList from "@components/CommentsList";
import ContentCardLarge from "@components/ContentCardLarge";
import Markdown from "@components/Markdown";
import Share from "@components/Share";
import SubscriptionForm from "@components/SubscriptionForm";
import { APP_TITLE, DATE_FORMATS, ISR_INTERVAL } from "@constants/app";
import firestore from "@fb/server";
import { scrollToRef } from "@lib/utils";
import { commentsList, getRelatedStories } from "@services/server";
import { IconArrowDown, IconArrowRight, IconPoint } from "@tabler/icons";
import axios from "axios";
import dayjs from "dayjs";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense, useRef } from "react";
import styles from "../../../styles/modules/Story.module.scss";

const TagsList = dynamic(() => import("../../../components/TagsList"), {
  ssr: false,
});

export default function StoryDetails({
  story,
  chapters,
  comments = [],
  relatedStories = [],
}) {
  const router = useRouter();
  const ref = useRef();
  // TODO: Create a loading component
  if (router.isFallback) return "Loading...";

  const goToForm = () => {
    document.getElementById("inpSub")?.focus();
  };

  return (
    <>
      <NextSeo
        title={story.title}
        description={story.excerpt}
        openGraph={{
          description: story.excerpt,
          type: "article",
          title: story.title,
          article: {
            publishedTime: story.published,
            tags: story.tags,
            authors: [story.author],
          },
          images: [
            {
              url: story.cover,
              width: 1280,
              height: 720,
              alt: story.slug + "-cover",
            },
          ],
        }}
      />
      <div className={styles.story}>
        <div
          className={`container-fluid shadow ${styles.story__header}`}
          style={{ backgroundImage: `url(${story.cover})` }}
        >
          <h1 className="display-1">{story.title}</h1>
          <p className="my-3">
            <span>{story.author}</span>
            <span className="mx-1 text-light">
              <IconPoint size={16} />
            </span>
            <span>{story.chapterSlugs.length} Chapters</span>
            <span className="mx-1 text-light">
              <IconPoint size={16} />
            </span>
            <span>{dayjs(story.published).format(DATE_FORMATS.date)}</span>
          </p>
          <p className={styles.excerpt}>{story.excerpt}</p>
          <button
            className="icon-btn icon-btn__lg mt-3"
            data-bs-toggle="tooltip"
            data-bs-offset="0,5"
            data-bs-placement="bottom"
            title="Scroll To Content"
            onClick={() => scrollToRef(ref, 140)}
          >
            <IconArrowDown size={36} />
          </button>
        </div>
        <div className="container mt-4">
          <h2 className="text-primary">Preface</h2>
          <div className="mt-2">
            <Suspense fallback="...">
              <TagsList tags={story.tags} />
            </Suspense>
          </div>
        </div>
        <Markdown {...story.preface} theme="dark" fontSize={18} ref={ref} />
        <div className="container">
          <h2 className="text-primary">Chapters</h2>
          <div className="row mt-3 mt-md-4">
            {chapters.map((ch) => (
              <div className="col-md-6 mb-3 mb-md-4" key={ch.slug}>
                <Link
                  href={`/stories/${story.slug}/${ch.slug}`}
                  className={`shadow ${styles.chapter}`}
                >
                  <h4 className="mb-2">{ch.title}</h4>
                  <p className="small mb-0">{ch.excerpt}</p>
                </Link>
              </div>
            ))}
            {story.wip && (
              <div className="col-md-6 mb-3 mb-md-4">
                <div className={styles.wip}>
                  <h4 className="mb-1 text-center">To Be Continued...</h4>
                  <p className="text-muted mb-0 text-center">
                    <span className="text-primary">
                      &ldquo;{story.title}&rdquo;
                    </span>{" "}
                    is an ongoing story. More chapters are coming soon. <br />
                    <button
                      className="btn p-1 btn-primary border-0 bg-dark no-glow text-decoration-underline"
                      onClick={goToForm}
                    >
                      Subscribe now
                    </button>{" "}
                    to get notified of new chapters.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3">
            <Share
              title={story.title}
              url={router.asPath}
              contentType="story"
            />
          </div>
          <CommentsList
            type="stories"
            title={story.title}
            comments={comments}
            target={story.slug}
          />
          <p className="h3 mb-1 text-primary">
            More Like this on {APP_TITLE}...
          </p>
          {relatedStories.length > 0 ? (
            <div className="row mt-3">
              {relatedStories.map((story) => (
                <div className="col-md-6 mb-3" key={story.slug}>
                  <ContentCardLarge data={story} variant="stories" />
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center my-3">
              <Link className="btn btn-primary" href="/stories">
                <span className="me-1">View All Stories</span>
                <IconArrowRight size={18} />
              </Link>
            </div>
          )}
          <SubscriptionForm />
          <div className="d-flex justify-content-center my-3">
            <Link
              className="btn btn-outline-primary icon-right"
              href="/submissions"
            >
              Submit your work to {APP_TITLE}
              <IconArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/** @type {import('next').GetStaticPaths} */
export async function getStaticPaths() {
  const response = await firestore
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("published", "desc")
    .get();
  const paths = response.docs.map((doc) => ({
    params: {
      slug: doc.id,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps(ctx) {
  const { params } = ctx;

  const storyRes = await firestore.doc(`stories/${params.slug}`).get();
  const prefaceRes = await axios.get(storyRes.data().content);
  const commentsRes = await commentsList("stories", params.slug);
  const chapterRes = await firestore
    .collection(`stories/${params.slug}/chapters`)
    .orderBy("order", "asc")
    .get();
  const relatedStoriesRes = await getRelatedStories(
    params.slug,
    storyRes.data().tags
  );

  const { content: prefaceRaw } = grayMatter(prefaceRes.data);
  const story = {
    ...storyRes.data(),
    slug: storyRes.id,
    published: storyRes.data().published.toDate().toISOString(),
    lastUpdated: storyRes.data().lastUpdated.toDate().toISOString(),
    preface: await serialize(prefaceRaw),
  };
  delete story.content;

  const chapters = chapterRes.docs.map((doc) => {
    const obj = {
      ...doc.data(),
      slug: doc.id,
    };
    delete obj.content;
    return obj;
  });

  return {
    props: {
      story,
      chapters,
      comments: commentsRes.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date.toDate().toISOString(),
      })),
      relatedStories: relatedStoriesRes.docs.map((doc) => {
        const obj = {
          ...doc.data(),
          slug: doc.id,
          published: doc.data().published.toDate().toISOString(),
          lastUpdated: doc.data().lastUpdated.toDate().toISOString(),
        };
        delete obj.content;
        return obj;
      }),
    },
    revalidate: ISR_INTERVAL * 24 * 7, // revalidate every 1 week
  };
}
