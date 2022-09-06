import {
  ActionIcon,
  Box,
  Center,
  Container,
  createStyles,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import axios from "axios";
import dayjs from "dayjs";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";
import { ArrowDown, Point } from "tabler-icons-react";
import Comments from "../../../components/comments/Comments";
import LoadingContent from "../../../components/LoadingContent";
import RenderMarkdown from "../../../components/markdown/RenderMarkdown";
import { DATE_FORMATS, ISR_INTERVAL } from "../../../constants/app.constants";
import firestore from "../../../firebase/config";
import { useMediaMatch } from "../../../hooks/isMobile";
import useHeaderPageStyles from "../../../styles/headerPage.styles";
import { scrollToContent } from "../../../utils/utils";

export default function StoryDetails({ story, chapters, comments = [] }) {
  const isMobile = useMediaMatch();
  const router = useRouter();
  const { classes } = useHeaderPageStyles({ isMobile });
  const {
    classes: { card: cardStyles },
  } = useCardStyles();

  if (router.isFallback) {
    return <LoadingContent />;
  }

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
      <Center
        className={classes.header}
        sx={{
          backgroundImage: `url(${story.cover})`,
        }}>
        <Box className={classes.headerContent}>
          <Text className={classes.title}>{story.title}</Text>
          <Group spacing={4} position="center" mt="xs">
            <Text size="sm">{story.author}</Text>
            <Point size={8} />
            <Text size="sm">{story.chapterCount} Chapters</Text>
            <Point size={8} />
            <Text size="sm">
              {dayjs(story.published).format(DATE_FORMATS.date)}
            </Text>
          </Group>
          <Text
            align="center"
            my="md"
            italic
            color="dimmed"
            size="sm"
            sx={{ maxWidth: "350px" }}>
            {story.excerpt}
          </Text>
          <Group position="center" align="center">
            <ActionIcon
              variant="subtle"
              size="xl"
              radius="xl"
              mt={24}
              onClick={() => scrollToContent("contentBlock")}>
              <ArrowDown />
            </ActionIcon>
          </Group>
        </Box>
      </Center>
      <Container
        size="md"
        pb="xl"
        id="contentBlock"
        py={isMobile ? "1rem" : "2.25rem"}>
        <Box className="story-preface">
          <RenderMarkdown {...story.preface} />
        </Box>
        <Text color="dimmed" size="xl" my="lg" weight={500}>
          Chapters List
        </Text>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}>
          {chapters.map((chapter) => (
            <Box className={cardStyles} key={chapter.slug}>
              <Text
                size="lg"
                weight="bold"
                variant="link"
                component={NextLink}
                sx={(theme) => ({ color: theme.colors.gray[4] })}
                href={`/stories/${story.slug}/${chapter.slug}`}>
                {chapter.title}
              </Text>
              <Text size="sm" color="dimmed" mt="sm">
                {chapter.excerpt}
              </Text>
            </Box>
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

const useCardStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.dark[8],
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.dark[6]}`,
    transition: "all 0.2s",
    "&:hover, &:focus-within": {
      backgroundColor: theme.colors.dark[6],
      boxShadow: theme.shadows.md,
    },
  },
}));

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
    revalidate: ISR_INTERVAL,
  };
}
