import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React from "react";
import readingTime from "reading-time";
import { ChevronLeft, ChevronRight, Point } from "tabler-icons-react";
import RenderMarkdown from "../../../components/markdown/RenderMarkdown";
import firestore from "../../../firebase/config";

export default function SingleChapter({ metadata, content }) {
  const { primaryColor } = useMantineTheme();

  return (
    <>
      <NextSeo
        title={`${metadata.title} | The Pilfered Diaries`}
        description={metadata.excerpt}
      />
      <Container size="md" pt="4rem">
        <Text
          sx={(theme) => ({
            fontSize: "2rem",
            marginTop: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            color: theme.colors.indigo[4],
          })}>
          {metadata.title}
        </Text>
        <Group spacing={4} position="center">
          <Text color="dimmed" size="sm">
            by {metadata.author}
          </Text>
          <Point size={10} style={{ marginTop: "2px" }} />
          <Text color="dimmed" size="sm">
            {metadata.readTime.text} ({metadata.readTime.words} words)
          </Text>
        </Group>
        <Divider variant="dashed" my="md" color={primaryColor} />
        <Box className="story-content" mt="lg">
          <RenderMarkdown {...content} />
        </Box>
        <Divider variant="dashed" color="indigo" my="lg" />
        <SimpleGrid cols={2} spacing="md">
          <Group mb="lg" position="right">
            {metadata.previousChapter && (
              <Link
                passHref
                scroll
                href={`/stories/${metadata.parent}/${metadata.previousChapter}`}>
                <Button
                  component="a"
                  leftIcon={<ChevronLeft size={18} />}
                  size="sm"
                  variant="subtle"
                  fullWidth>
                  Previous Chapter
                </Button>
              </Link>
            )}
          </Group>
          <Group mb="lg" position="left">
            {metadata.nextChapter && (
              <Link
                passHref
                scroll
                href={`/stories/${metadata.parent}/${metadata.nextChapter}`}>
                <Button
                  component="a"
                  rightIcon={<ChevronRight size={18} />}
                  size="sm"
                  variant="subtle"
                  fullWidth>
                  Next Chapter
                </Button>
              </Link>
            )}
          </Group>
        </SimpleGrid>
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  const paths = (await firestore.collection("stories").get()).docs.flatMap(
    (doc) => {
      const chapterPaths = doc.data().chapterSlugs.map((chapter) => ({
        params: {
          slug: doc.id,
          chapter,
        },
      }));
      return chapterPaths;
    }
  );

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const filePath = (
    await firestore
      .doc(`stories/${params.slug}/chapters/${params.chapter}`)
      .get()
  ).data().content;

  const storyFile = await axios.get(filePath);
  const { data: metadata, content: source } = grayMatter(storyFile.data);
  const time = readingTime(source);
  metadata["readTime"] = time;
  const content = await serialize(source);

  return {
    props: {
      metadata,
      content,
    },
  };
}
