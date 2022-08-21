import { Container, createStyles } from "@mantine/core";
import fs from "fs";
import grayMatter from "gray-matter";
import Image from "next/image";
import { join } from "path";
import React from "react";

function Chapter({ chapterMeta, content }) {
  console.log({ chapterMeta, content });
  return (
    <Container size="lg" mt="md">
      {/* <Image
        src={
          "https://firebasestorage.googleapis.com/v0/b/the-pilfered-diaries.appspot.com/o/postHeaders%2Fthe-obsession.jpg?alt=media&token=607668da-e3f3-4435-99da-cd273f816e04"
        }
        height={720}
        width={1280}
        alt={`${chapterMeta.title} Header`}
      /> */}
    </Container>
  );
}

export default Chapter;

export async function getStaticPaths() {
  const paths = fs
    .readdirSync(join(process.cwd(), "content/stories"), {
      withFileTypes: true,
    })
    .filter((item) => !item.name.includes(".mdx"))
    .flatMap((folder) => {
      const files = fs.readdirSync(
        join(process.cwd(), `content/stories/${folder.name}`)
      );
      return files.map((file) => ({
        params: {
          chapter: file.split(".")[0],
          slug: folder.name,
        },
      }));
    });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const storyFile = fs.readFileSync(
    join(process.cwd(), `content/stories/${params.slug}/${params.chapter}.mdx`)
  );
  const { data: chapterMeta, content } = grayMatter(storyFile);

  return {
    props: {
      chapterMeta,
      content,
    },
  };
}
