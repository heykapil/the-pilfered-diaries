import { ActionIcon, Box, Center, Container, Group, Text } from "@mantine/core";
import axios from "axios";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import React from "react";
import readingTime from "reading-time";
import { ArrowDown, Point } from "tabler-icons-react";
import Comments from "../../components/comments/Comments";
import RenderMarkdown from "../../components/markdown/RenderMarkdown";
import { REVALIDATION_INTERVAL } from "../../constants/app.constants";
import firestore from "../../firebase/config";
import { useMediaMatch } from "../../hooks/isMobile";

export default function SinglePost({ meta, content, comments }) {
  const isMobile = useMediaMatch();

  const scrollToContent = () => {
    const { offsetTop } = document.getElementById("contentBlock");
    document.scrollingElement.scrollTo({
      top: offsetTop - 50,
      behavior: "smooth",
    });
  };

  return (
    <>
      <NextSeo
        title={`${meta.title} | The Pilfered Diaries`}
        description={meta.excerpt}
      />
      <Center
        px={0}
        pb="2rem"
        sx={{
          height: "100vh",
          backgroundImage: `url(${meta.cover})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          flexDirection: "column",
        }}>
        <Box
          p="lg"
          sx={(theme) => ({
            backgroundColor: `${theme.black}AA`,
            borderRadius: theme.radius.md,
            backdropFilter: "blur(8px)",
          })}>
          <Text
            sx={(theme) => ({
              fontSize: isMobile ? "2rem" : "4rem",
              textAlign: "center",
              color: theme.white,
            })}>
            {meta.title}
          </Text>
          <Group spacing={4} position="center">
            <Text size="sm">by {meta.author}</Text>
            <Point size={12} style={{ marginTop: "2px" }} />
            <Text size="sm">
              {meta.readTime.text} ({meta.readTime.words} words)
            </Text>
          </Group>
          <Group position="center" align="center">
            <ActionIcon
              variant="subtle"
              size="xl"
              radius="xl"
              mt={24}
              onClick={scrollToContent}>
              <ArrowDown />
            </ActionIcon>
          </Group>
        </Box>
      </Center>
      <Container size="md" id="contentBlock" pt={isMobile ? 16 : 36}>
        <RenderMarkdown {...content} />
        <Comments
          title={meta.title}
          type="posts"
          comments={comments}
          target={meta.slug}
        />
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  const response = await firestore.collection("posts").get();
  const paths = response.docs.map((doc) => ({
    params: {
      slug: doc.id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx) {
  const { params } = ctx;
  const response = await firestore.doc(`posts/${params.slug}`).get();
  const commentsRes = await firestore
    .collection("comments")
    .orderBy("date", "desc")
    .where("type", "==", "posts")
    .where("target", "==", params.slug)
    .where("approved", "==", true)
    .get();

  const file = await axios.get(response.data().content);
  const { content } = grayMatter(file.data);

  return {
    props: {
      content: await serialize(content),
      meta: {
        ...response.data(),
        readTime: readingTime(content),
        published: response.data().published.toDate().toISOString(),
        slug: params.slug,
      },
      comments:
        commentsRes.docs.length > 0
          ? commentsRes.docs.map((doc) => ({
              ...doc.data(),
              date: doc.data().date.toDate().toISOString(),
              id: doc.id,
            }))
          : [],
    },
    revalidate: REVALIDATION_INTERVAL,
  };
}
