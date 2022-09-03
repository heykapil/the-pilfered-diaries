import {
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  Text,
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
  TAGLINE,
} from "../constants/app.constants";
import firestore from "../firebase/config";
import { useMediaMatch } from "../hooks/isMobile";
import header from "../resources/images/header-bg.jpg";
import { scrollToContent } from "../utils/utils";

export default function Home({ stories, posts }) {
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  return (
    <>
      <Container fluid px={0} className={classes.headerBg}>
        <Container size="lg" px="xs" className={classes.header}>
          <Text className={classes.tagline}>{TAGLINE}</Text>
          <Text className={classes.siteName}>{APP_TITLE}</Text>
          <Group
            mt="sm"
            spacing={4}
            align="center"
            sx={{ cursor: "pointer", width: "fit-content" }}>
            <BrandInstagram color="gray" size={22} />{" "}
            <Text
              component={NextLink}
              href={INSTA_LINK}
              color="dimmed"
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
            size="xl"
            leftIcon={<ArrowDown />}
            onClick={() => scrollToContent("aboutBlock")}>
            Start Reading
          </Button>
        </Container>
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
        <GuestPostsHome posts={[]} />
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const storiesRes = await firestore
    .collection("stories")
    .orderBy("published", "desc")
    .limit(5)
    .get();
  const postsRes = await firestore
    .collection("posts")
    .where("isGuestPost", "==", false)
    .orderBy("published", "desc")
    .limit(5)
    .get();

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

  return {
    props: {
      stories,
      posts,
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
    height: "100vh",
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
