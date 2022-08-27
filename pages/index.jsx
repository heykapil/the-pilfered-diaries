import { Container, createStyles, Grid, Group, Text } from "@mantine/core";
import Link from "next/link";
import { BrandInstagram } from "tabler-icons-react";
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

export default function Home({ stories, posts }) {
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  return (
    <>
      <Container fluid px={0} className={classes.headerBg}>
        <Container
          size="lg"
          px="xs"
          className={classes.header}
          sx={{ height: isMobile ? "90vh" : "82vh" }}>
          <Text className={classes.tagline}>{TAGLINE}</Text>
          <Text className={classes.siteName}>{APP_TITLE}</Text>
          <Link href={INSTA_LINK} passHref target="_blank">
            <Group
              mt="sm"
              spacing={4}
              sx={{ cursor: "pointer", width: "fit-content" }}>
              <BrandInstagram color="gray" />{" "}
              <Text component="span" color="dimmed" variant="link">
                {INSTA_HANDLE}
              </Text>
            </Group>
          </Link>
        </Container>
      </Container>
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
