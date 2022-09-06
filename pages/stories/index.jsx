import { Container, SimpleGrid, Text } from "@mantine/core";
import { NextSeo } from "next-seo";
import React from "react";
import LargeCard from "../../components/cards/LargeCard";
import {
  APP_TITLE,
  ISR_INTERVAL,
  SITE_URL,
} from "../../constants/app.constants";
import { storiesList } from "../../services/serverData.promises";

export default function StoriesList({ stories = [] }) {
  return (
    <>
      <NextSeo
        title="Latest Stories"
        description={`Latest stories on ${APP_TITLE}`}
        openGraph={{
          type: "page",
          url: SITE_URL + "/stories",
        }}
      />
      <Container size="lg" pt="70px">
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
    </>
  );
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const response = await storiesList(25);
  const stories = response.docs.map((doc) => ({
    ...doc.data(),
    slug: doc.id,
    published: doc.data().published.toDate().toISOString(),
  }));

  return {
    props: {
      stories,
    },
    revalidate: ISR_INTERVAL,
  };
}
