import {
  Box,
  Button,
  Container,
  createStyles,
  Group,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import fs from "fs";
import grayMatter from "gray-matter";
import { join } from "path";
import { BrandInstagram } from "tabler-icons-react";
import StoryCard from "../components/StoryCard";
import { useMediaMatch } from "../hooks/isMobile";

export default function Home({ stories = [], totalStories }) {
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  return (
    <>
      <Container size="lg" p="sm" mb="xl">
        <Box
          className={classes.header}
          sx={{ height: isMobile ? "75vh" : "60vh" }}>
          <Text className={classes.tagline}>
            When lost words are found by a thinker, stories happen. . . .
          </Text>
          <Text className={classes.siteName}>The Pilfered Diaries</Text>
          <Group spacing="sm">
            <BrandInstagram /> /the.pilfered.diaries
          </Group>
        </Box>
        <Text
          sx={{ fontSize: "1.25rem" }}
          color="dimmed"
          mb={"1.5rem"}
          mt="2rem">
          Latest Stories
        </Text>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[
            { maxWidth: breakpoints.md, cols: 2 },
            { maxWidth: breakpoints.sm, cols: 1 },
          ]}>
          {stories.map((story) => (
            <StoryCard key={story.frontMatter.slug} meta={story.frontMatter} />
          ))}
        </SimpleGrid>
        {totalStories > 5 && (
          <Group position="center" mt="lg">
            <Button
              size="sm"
              component={NextLink}
              href="/stories"
              fullWidth={isMobile}>
              View All Stories
            </Button>
          </Group>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const files = fs
    .readdirSync(join(process.cwd(), "content/stories"), {
      withFileTypes: true,
    })
    .filter((file = "") => {
      return file.name.includes(".mdx");
    });

  const stories = files
    .slice(0, 5)
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
      totalStories: files.length,
    },
  };
}

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  tagline: {
    fontSize: "3.5rem",
    lineHeight: "1",
    marginTop: "4rem",
    fontWeight: 700,
  },
  siteName: {
    fontSize: "1.5rem",
    lineHeight: "1",
    marginTop: "1.25rem",
    marginBottom: "0.5rem",
    color: theme.colors.orange[6],
    fontWeight: 500,
  },
}));
