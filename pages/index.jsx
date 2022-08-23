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
import { ArrowRight, BrandInstagram } from "tabler-icons-react";
import StoryCard from "../components/cards/StoryCard";
import firestore from "../firebase/config";
import { useMediaMatch } from "../hooks/isMobile";

export default function Home({ stories }) {
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  return (
    <>
      <Container size="lg" p="sm" pb="xl">
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
        <Group position="apart" align="center">
          <Text
            sx={{ fontSize: "1.25rem" }}
            color="dimmed"
            mb={"1.5rem"}
            mt="2rem">
            Latest Stories
          </Text>
          <Button
            size="sm"
            component={NextLink}
            href="/stories"
            variant="subtle"
            rightIcon={<ArrowRight size={16} />}>
            All Stories
          </Button>
        </Group>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[
            { maxWidth: breakpoints.md, cols: 2 },
            { maxWidth: breakpoints.sm, cols: 1 },
          ]}>
          {stories.map((story) => (
            <StoryCard key={story.slug} data={story} showChapterCount />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const response = await firestore
    .collection("stories")
    .orderBy("published", "desc")
    .limit(5)
    .get();
  const stories = response.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      stories: stories,
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
    color: theme.colors.indigo[6],
    fontWeight: 500,
  },
}));
