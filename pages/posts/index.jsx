import { Container, SimpleGrid, Text } from "@mantine/core";
import { NextSeo } from "next-seo";
import React from "react";
import LargeCard from "../../components/cards/LargeCard";
import { APP_TITLE } from "../../constants/app.constants";
import firestore from "../../firebase/config";

export default function PostsList({ posts }) {
  return (
    <>
      <NextSeo
        title="Latest Posts"
        description={`Latest posts on ${APP_TITLE}`}
        openGraph={{
          type: "page",
          url: "https://thepilfereddiaries.in/posts",
        }}
      />
      <Container fluid pt="70px" px={0}>
        <Text weight={500} size="xl" align="center">
          Latest Posts on
        </Text>
        <Text weight={500} size="2rem" align="center" mb="2rem" color="indigo">
          {APP_TITLE}
        </Text>
        <Container size="lg" px="xs">
          <SimpleGrid
            cols={2}
            spacing="md"
            mb="2rem"
            breakpoints={[
              { maxWidth: "md", cols: 2 },
              { maxWidth: "sm", cols: 1 },
            ]}>
            {posts.map((post) => (
              <LargeCard data={post} variant="posts" key={post.slug} />
            ))}
          </SimpleGrid>
        </Container>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const response = await firestore
    .collection("posts")
    .orderBy("published", "desc")
    .limit(25)
    .get();
  const posts = response.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      posts,
    },
  };
}
