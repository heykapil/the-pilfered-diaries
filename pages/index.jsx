import {
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { ArrowDown, BrandInstagram } from "tabler-icons-react";
import AboutHome from "../components/blocks/AboutHome";
import GuestPostsHome from "../components/blocks/GuestPostsHome";
import PostsListHome from "../components/blocks/PostsListHome";
import StoriesListHome from "../components/blocks/StoriesListHome";
import {
  APP_TITLE,
  INSTA_HANDLE,
  INSTA_LINK,
  ISR_INTERVAL,
  TAGLINE,
} from "../constants/app.constants";
import { useMediaMatch } from "../hooks/isMobile";
import { postsList, storiesList } from "../services/serverData.promises";
import { scrollToContent } from "../utils/utils";
import firestore from "../firebase/config";

export default function Home({ stories, posts, guestPosts, siteCover }) {
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  return (
    <>
      <Container
        fluid
        px={0}
        className={classes.headerBg}
        sx={{ backgroundImage: `url(${siteCover.url})` }}>
        <Container size="lg" px="xs" className={classes.header}>
          <Text className={classes.tagline} weight={600}>
            {TAGLINE}
          </Text>
          <Text className={classes.siteName}>{APP_TITLE}</Text>
          <Group
            mt="sm"
            spacing={4}
            align="center"
            position="center"
            sx={{ cursor: "pointer" }}>
            <ThemeIcon mr={4} color="indigo" variant="light" radius="xl">
              <BrandInstagram size={18} />
            </ThemeIcon>
            <Text
              component={NextLink}
              href={INSTA_LINK}
              sx={(theme) => ({ color: theme.colors.indigo[3] })}
              variant="link">
              {INSTA_HANDLE}
            </Text>
          </Group>
          <Button
            mt="lg"
            variant="subtle"
            color="gray"
            radius="md"
            mr="auto"
            size={isMobile ? "md" : "xl"}
            fullWidth
            leftIcon={<ArrowDown />}
            onClick={() => scrollToContent("aboutBlock")}>
            Start Reading
          </Button>
        </Container>
        <Text
          size={isMobile ? "xs" : "sm"}
          color="dimmed"
          component="p"
          className={classes.creditText}>
          Photo By:{" "}
          <Text component="span" weight={600}>
            {siteCover.photoCredit}
          </Text>
        </Text>
      </Container>
      <AboutHome />
      <Container size="lg" p="sm" pb="xl">
        <Grid columns={24}>
          <Grid.Col sm={24} md={14}>
            <StoriesListHome stories={stories} />
          </Grid.Col>
          <Grid.Col sm={24} md={10} px={isMobile ? 8 : "sm"}>
            <PostsListHome posts={posts} />
          </Grid.Col>
        </Grid>
        <GuestPostsHome posts={guestPosts} />
      </Container>
    </>
  );
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const [storiesRes, postsRes, guestPostsRes] = await Promise.all([
    storiesList(5),
    postsList("owned", 5),
    postsList("guest", 3),
  ]);

  const headerId = (
    await firestore.doc("siteContent/site-config").get()
  ).data();
  const siteCover = (
    await firestore
      .doc(`siteContent/site-config/headers/${headerId.headerImg}`)
      .get()
  ).data();

  const stories = storiesRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  const posts = postsRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));
  const guestPosts = guestPostsRes.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      stories,
      posts,
      guestPosts,
      siteCover,
    },
    revalidate: ISR_INTERVAL,
  };
}

const useStyles = createStyles((theme) => ({
  headerBg: {
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    position: "relative",
  },
  creditText: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: "fit-content",
    textAlign: "end",
    margin: 0,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100vh",
  },
  tagline: {
    fontSize: "3.5rem",
    lineHeight: "1",
    color: theme.colors.gray[1],
    textAlign: "center",
  },
  siteName: {
    fontSize: "1.5rem",
    lineHeight: "1",
    marginTop: "1.25rem",
    marginBottom: "0.5rem",
    color: theme.colors.indigo[1],
    fontWeight: 500,
    textAlign: "center",
  },
}));
