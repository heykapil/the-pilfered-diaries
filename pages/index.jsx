import {
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  Text,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { ArrowRight, BrandInstagram } from "tabler-icons-react";
import PostCard from "../components/cards/PostCard";
import StoryCard from "../components/cards/StoryCard";
import { APP_TITLE } from "../constants/app.constants";
import firestore from "../firebase/config";
import { useMediaMatch } from "../hooks/isMobile";
import header from "../resources/images/header-bg.jpg";

export default function Home({ stories }) {
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  return (
    <>
      <Container fluid px={0} className={classes.headerBg}>
        <Container
          size="lg"
          className={classes.header}
          sx={{ height: isMobile ? "90vh" : "82vh" }}>
          <Text className={classes.tagline}>
            When a thinker finds lost words,
            <br />
            Stories Happen. . . .
          </Text>
          <Text className={classes.siteName}>{APP_TITLE}</Text>
          <Group spacing={4} mt="sm">
            <BrandInstagram color="gray" />{" "}
            <Text component="span" color="dimmed">
              /the.pilfered.diaries
            </Text>
          </Group>
        </Container>
      </Container>
      <Container size="lg" p="sm" pb="xl">
        <Grid columns={24}>
          <Grid.Col sm={24} md={14}>
            <Group position="apart" align="center" my="md">
              <Text sx={{ fontSize: "1.25rem" }} color="dimmed">
                Stories
              </Text>
              <Button
                size="sm"
                component={NextLink}
                href="/stories"
                variant="outline"
                rightIcon={<ArrowRight size={16} />}>
                All Stories
              </Button>
            </Group>
            {stories.map((story) => (
              <StoryCard key={story.slug} data={story} showChapterCount />
            ))}
          </Grid.Col>
          <Grid.Col sm={24} md={10}>
            <Group position="apart" align="center" my="md">
              <Text sx={{ fontSize: "1.25rem" }} color="dimmed">
                Posts
              </Text>
              <Button
                size="sm"
                component={NextLink}
                href="/posts"
                variant="subtle"
                rightIcon={<ArrowRight size={16} />}>
                All Posts
              </Button>
            </Group>
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <Text mt="md" align="center">
              Want to get featured on {APP_TITLE}?
            </Text>
            <Button
              component={NextLink}
              rightIcon={<ArrowRight size={18} />}
              fullWidth
              weight={500}
              variant="subtle"
              mt="sm"
              color="indigo"
              href="/submissions">
              Submit your content
            </Button>
          </Grid.Col>
        </Grid>
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
  headerBg: {
    backgroundImage: `url(${header.src})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  tagline: {
    fontSize: "3.5rem",
    lineHeight: "1",
    fontWeight: 700,
    color: theme.colors.gray[1],
  },
  siteName: {
    fontSize: "1.5rem",
    lineHeight: "1",
    marginTop: "1.25rem",
    marginBottom: "0.5rem",
    color: theme.colors.indigo[1],
    fontWeight: 500,
  },
}));
