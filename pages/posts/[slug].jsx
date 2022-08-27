import {
  Container,
  Divider,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import grayMatter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import readingTime from "reading-time";
import { Point } from "tabler-icons-react";
import Comments from "../../components/comments/Comments";
import SectionBreak from "../../components/textElements/SectionBreak";
import { REVALIDATION_INTERVAL } from "../../constants/app.constants";
import firestore from "../../firebase/config";

export default function SinglePost({ meta, content, comments }) {
  const { primaryColor } = useMantineTheme();
  return (
    <>
      <NextSeo
        title={`${meta.title} | The Pilfered Diaries`}
        description={meta.excerpt}
      />
      <Container fluid pt="70px" px={0} pb="2rem">
        <Image
          width={1920}
          height={1080}
          src={meta.cover}
          alt={meta.slug + "-cover"}
          placeholder="empty"
        />
        <Text
          sx={{
            fontSize: "2rem",
            marginTop: "2rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
          color="indigo">
          {meta.title}
        </Text>
        <Group spacing={4} position="center">
          <Text color="dimmed" size="sm">
            by {meta.author}
          </Text>
          <Point size={8} color={primaryColor} style={{ marginTop: "2px" }} />
          <Text color="dimmed" size="sm">
            {meta.readTime.text} ({meta.readTime.words} words)
          </Text>
        </Group>
        <Container size="md">
          <Divider variant="dashed" my="md" color={primaryColor} />
          <MDXRemote
            {...content}
            components={{
              SectionBreak,
              Link,
            }}
          />
          <Comments
            title={meta.title}
            type="posts"
            comments={comments}
            target={meta.slug}
          />
        </Container>
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
