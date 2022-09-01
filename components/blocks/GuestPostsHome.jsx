import { Box, Button, Group, SimpleGrid, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import Image from "next/image";
import React from "react";
import { ArrowRight } from "tabler-icons-react";
import { APP_TITLE } from "../../constants/app.constants";
import { useMediaMatch } from "../../hooks/isMobile";
import noPostsArt from "../../resources/images/NoGuestPosts.svg";
import LargeCard from "../cards/LargeCard";

export default function GuestPostsHome({ posts = [] }) {
  const isMobile = useMediaMatch();

  return (
    <Box>
      <Group position="apart" align="center" my="md">
        <Text
          sx={{ fontSize: "1.25rem" }}
          color="dimmed"
          component="h2"
          weight={400}>
          Guest Posts
        </Text>
        {posts.length > 1 && (
          <Button
            size="sm"
            component={NextLink}
            href="/stories"
            variant="outline"
            rightIcon={<ArrowRight size={16} />}>
            Submit Your Own
          </Button>
        )}
      </Group>
      {posts.length > 0 ? (
        <SimpleGrid
          cols={3}
          spacing="md"
          breakpoints={[
            { maxWidth: "md", cols: 3 },
            { maxWidth: "sm", cols: 1 },
          ]}>
          {posts.map((post) => (
            <LargeCard key={post.slug} variant="posts" data={post} />
          ))}
        </SimpleGrid>
      ) : (
        <Group
          mt="lg"
          spacing={4}
          sx={{ flexDirection: "column" }}
          position="center"
          align="center">
          <Image
            src={noPostsArt}
            width={isMobile ? 300 : 500}
            alt="no-guest-posts-artwork"
          />
          <Text align="center" mt="md">
            Publish the first guest post on {isMobile && <br />} {APP_TITLE}
          </Text>
          <Button
            variant="subtle"
            color="indigo"
            size="sm"
            fullWidth={isMobile}
            component={NextLink}
            href="/submissions">
            Send a Submission
          </Button>
        </Group>
      )}
    </Box>
  );
}
