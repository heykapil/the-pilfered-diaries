import React from "react";
import fs from "fs";
import grayMatter from "gray-matter";
import { join } from "path";
import {
  Box,
  Container,
  Group,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaMatch } from "../../../hooks/isMobile";
import dayjs from "dayjs";
import { Point } from "tabler-icons-react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import { NextLink } from "@mantine/next";

function Story({ data, content, chapters }) {
  const isMobile = useMediaMatch();
  const { breakpoints } = useMantineTheme();

  return (
    <Container size="lg" mt="lg">
      <Image
        src={data.headerImg}
        width={1280}
        height={720}
        alt={data.title + "Cover Img"}
        style={{ marginBottom: "1.25rem", borderRadius: "0.75rem" }}
      />
      <Text
        weight="bold"
        color="orange"
        sx={{
          textAlign: "center",
          fontSize: isMobile ? "1.75rem" : "2.5rem",
          marginTop: "2rem",
        }}>
        {data.title}
      </Text>
      <Group spacing={4} position="center">
        <Text size="sm" color="dimmed">
          {data.author}
        </Text>
        <Point size={8} />
        <Text size="sm" color="dimmed">
          {data.chapterCount} Chapters
        </Text>
        <Point size={8} />
        <Text size="sm" color="dimmed">
          {dayjs(data.date).format("MMM DD, YYYY")}
        </Text>
      </Group>
      <Box my={isMobile ? "2.5rem" : "4rem"} className="story-preface">
        <MDXRemote {...content} />
      </Box>
      <SimpleGrid
        cols={2}
        spacing="md"
        breakpoints={[
          { maxWidth: breakpoints.md, cols: 2 },
          { maxWidth: breakpoints.sm, cols: 1 },
        ]}>
        {chapters.map((story, i) => (
          <Box
            key={i}
            component={NextLink}
            sx={{ border: "1px solid gray" }}
            href={`${story.parent}/${story.slug}`}>
            <pre>{JSON.stringify(story, null, 2)}</pre>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default Story;

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const storyFile = fs.readFileSync(
    join(process.cwd(), `content/stories/${params.slug}.mdx`)
  );

  const chapterFiles = fs.readdirSync(
    join(process.cwd(), `content/stories/${params.slug}`),
    { withFileTypes: false }
  );
  const chapters = chapterFiles.map((file) => {
    const fileContent = fs.readFileSync(
      join(process.cwd(), `content/stories/${params.slug}/${file}`)
    );
    const { data: chapterMeta } = grayMatter(fileContent);
    return chapterMeta;
  });

  const { content, data } = grayMatter(storyFile);

  return {
    props: {
      data,
      content: await serialize(content),
      chapters,
    },
  };
}

export async function getStaticPaths() {
  const files = fs
    .readdirSync(join(process.cwd(), "content/stories"), {
      withFileTypes: true,
    })
    .filter((file = "") => {
      return file.name.includes(".mdx");
    });

  const paths = files.map((file) => ({
    params: {
      slug: file.name.split(".")[0],
    },
  }));
  return {
    paths,
    fallback: false,
  };
}
