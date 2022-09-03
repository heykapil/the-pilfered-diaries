import { Button, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import { ArrowRight } from "tabler-icons-react";
import PostCard from "../cards/PostCard";

export default function PostsListHome({ posts }) {
  return (
    <>
      <Group position="apart" align="center" my="md">
        <Text
          sx={{ fontSize: "1.25rem" }}
          color="dimmed"
          component="h2"
          weight={400}>
          Posts
        </Text>
        <Button
          size="xs"
          component={NextLink}
          href="/posts"
          variant="light"
          rightIcon={<ArrowRight size={16} />}>
          All Posts
        </Button>
      </Group>
      {posts.map((post) => (
        <PostCard key={post.slug} data={post} />
      ))}
    </>
  );
}
