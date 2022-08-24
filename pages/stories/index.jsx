import { Container, SimpleGrid, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import StoryCard from "../../components/cards/StoryCard";
import firestore from "../../firebase/config";

export default function StoriesList({ stories = [] }) {
  const { breakpoints } = useMantineTheme();
  return (
    <Container size="lg" pt="4.5rem" sx={{ minHeight: "100vh" }}>
      <Text weight={500} size="xl" align="center">
        Latest Stories on
      </Text>
      <Text weight={500} size="2rem" align="center" mb="2rem" color="indigo">
        The Pilfered Diaries
      </Text>
      <SimpleGrid
        cols={2}
        spacing="md"
        mb="2rem"
        breakpoints={[
          { maxWidth: breakpoints.md, cols: 2 },
          { maxWidth: breakpoints.sm, cols: 1 },
        ]}>
        {stories.map((story) => (
          <StoryCard key={story.slug} data={story} />
        ))}
      </SimpleGrid>
    </Container>
  );
}

export async function getServerSideProps() {
  const response = await firestore
    .collection("stories")
    .orderBy("published", "desc")
    .limit(25)
    .get();
  const stories = response.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      stories,
    },
  };
}
