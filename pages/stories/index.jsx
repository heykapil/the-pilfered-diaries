import { Container, SimpleGrid, Text } from "@mantine/core";
import fs from "fs";
import grayMatter from "gray-matter";
import { join } from "path";
import React from "react";
import StoryCard from "../../components/StoryCard";

function Stories({ stories = [] }) {
  return (
    <>
      <Container size="lg" mt="1.5rem">
        <Text weight={500} size="xl" align="center">
          Latest Stories on
        </Text>
        <Text weight={500} size="2rem" align="center" mb="2rem" color="orange">
          The Pilfered Diaries
        </Text>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[
            { maxWidth: 960, cols: 2 },
            { maxWidth: 600, cols: 1 },
          ]}>
          {stories.map((story) => (
            <StoryCard
              key={story.frontMatter.slug}
              meta={story.frontMatter}
              showChapterCount
            />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export default Stories;

export async function getServerSideProps() {
  const files = fs
    .readdirSync(join(process.cwd(), "content/stories"), {
      withFileTypes: true,
    })
    .filter((file = "") => {
      return file.name.includes(".mdx");
    });

  const stories = files
    .map((file) => {
      const storyFile = fs.readFileSync(
        join(process.cwd(), `content/stories/${file.name}`),
        "utf-8"
      );

      const { data: frontMatter } = grayMatter(storyFile);
      return { frontMatter };
    })
    .sort((s1, s2) => (s1.frontMatter.date > s2.frontMatter.date ? -1 : 1));

  return {
    props: {
      stories,
    },
  };
}
