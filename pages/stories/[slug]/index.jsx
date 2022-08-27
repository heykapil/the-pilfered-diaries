import {
  Box,
  Container,
  Group,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import dayjs from "dayjs";
import grayMatter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Point } from "tabler-icons-react";
import ChapterCard from "../../../components/cards/ChapterCard";
import Comments from "../../../components/comments/Comments";
import LoadingContent from "../../../components/LoadingContent";
import SectionBreak from "../../../components/textElements/SectionBreak";
import {
  DATE_FORMATS,
  REVALIDATION_INTERVAL,
} from "../../../constants/app.constants";
import firestore from "../../../firebase/config";
import { useMediaMatch } from "../../../hooks/isMobile";

export default function StoryDetails({ story, chapters, comments = [] }) {
  const isMobile = useMediaMatch();
  const { breakpoints } = useMantineTheme();
  const router = useRouter();

  if (router.isFallback) {
    return <LoadingContent />;
  }

  return (
    <>
      <NextSeo title={`Story - ${story.title} | The Pilfered Diaries`} />
      <Container fluid px={0} pt="70px">
        <Image
          src={story.cover}
          width={1920}
          height={1080}
          alt={story.slug + "-cover"}
        />
      </Container>
      <Container size="md" pb="xl">
        <Text
          weight="bold"
          color="indigo"
          sx={{
            textAlign: "center",
            fontSize: isMobile ? "1.75rem" : "2.5rem",
            marginTop: "1rem",
          }}>
          {story.title}
        </Text>
        <Group spacing={4} position="center">
          <Text size="sm" color="dimmed">
            {story.author}
          </Text>
          <Point size={8} />
          <Text size="sm" color="dimmed">
            {story.chapterCount} Chapters
          </Text>
          <Point size={8} />
          <Text size="sm" color="dimmed">
            {dayjs(story.published).format(DATE_FORMATS.date)}
          </Text>
        </Group>
        <SectionBreak />
        <Box my={isMobile ? "1rem" : "2.25rem"} className="story-preface">
          <MDXRemote {...story.preface} />
        </Box>
        <Text color="dimmed" size="xl" my="lg" weight={500}>
          Chapters List
        </Text>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[
            { maxWidth: breakpoints.md, cols: 2 },
            { maxWidth: breakpoints.sm, cols: 1 },
          ]}>
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.slug}
              data={chapter}
              storyName={story.slug}
            />
          ))}
        </SimpleGrid>
        <Comments
          title={story.title}
          comments={comments}
          type="stories"
          target={story.slug}
        />
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  const response = await firestore
    .collection("stories")
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

export async function getStaticProps(ctx) {
  const { params } = ctx;

  const storeRes = await firestore.doc(`stories/${params.slug}`).get();
  const prefaceRes = await axios.get(storeRes.data().content);
  const commentsRes = await firestore
    .collection("comments")
    .where("type", "==", "stories")
    .where("target", "==", params.slug)
    .where("approved", "==", true)
    .orderBy("date", "desc")
    .get();
  const chapterRes = await firestore
    .collection(`stories/${params.slug}/chapters`)
    .orderBy("order", "asc")
    .get();
  const { content: prefaceRaw } = grayMatter(prefaceRes.data);

  const story = {
    ...storeRes.data(),
    slug: storeRes.id,
    published: storeRes.data().published.toDate().toISOString(),
    preface: await serialize(prefaceRaw),
  };
  const chapters = chapterRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
  }));

  return {
    props: {
      story,
      chapters,
      comments: commentsRes.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date.toDate().toISOString(),
      })),
    },
    revalidate: REVALIDATION_INTERVAL,
  };
}
