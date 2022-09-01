import { Container, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import LargeCard from "../../components/cards/LargeCard";
import { APP_TITLE } from "../../constants/app.constants";
import firestore from "../../firebase/config";

export default function StoriesList({ stories = [] }) {
  return (
    <Container size="lg" pt="70px" sx={{ minHeight: "100vh" }}>
      <Text weight={500} size="xl" align="center">
        Latest Stories on
      </Text>
      <Text weight={500} size="2rem" align="center" mb="2rem" color="indigo">
        {APP_TITLE}
      </Text>
      <SimpleGrid
        cols={2}
        spacing="md"
        mb="2rem"
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "sm", cols: 1 },
        ]}>
        {stories.map((story) => (
          <LargeCard key={story.slug} data={story} />
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
