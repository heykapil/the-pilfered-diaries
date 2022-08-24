import {
  Box,
  Container,
  Group,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Point } from "tabler-icons-react";
import firestore from "../../../firebase/config";
import { useMediaMatch } from "../../../hooks/isMobile";
import axios from "axios";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import SectionBreak from "../../../components/textElements/SectionBreak";
import ChapterCard from "../../../components/cards/ChapterCard";
import { NextSeo } from "next-seo";

export default function StoryDetails({ story, chapters }) {
  const isMobile = useMediaMatch();
  const { breakpoints } = useMantineTheme();

  return (
    <>
      <NextSeo title={`Story - ${story.title} | The Pilfered Diaries`} />
      <Container fluid px={0}>
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
            {dayjs(story.published).format("MMM DD, YYYY")}
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
        <Box mt="lg">
          <Text color="dimmed" size="xl" my="lg" weight={500}>
            Comments & Responses
          </Text>
        </Box>
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
    fallback: false,
  };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;

  const storeRes = await firestore.doc(`stories/${params.slug}`).get();
  const chapterRes = await firestore
    .collection(`stories/${params.slug}/chapters`)
    .orderBy("order", "asc")
    .get();
  const prefaceRes = await axios.get(storeRes.data().content);
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
    },
  };
}
