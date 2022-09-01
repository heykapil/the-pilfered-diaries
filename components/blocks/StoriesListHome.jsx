import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  createStyles,
  Group,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Image from "next/image";
import React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "tabler-icons-react";
import artwork from "../../resources/images/submissions-artwork.svg";
import StoryCard from "../cards/StoryCard";

export default function StoriesListHome({ stories }) {
  const { classes } = useStyles();
  return (
    <>
      <Group position="apart" align="center" my="md">
        <Text
          sx={{ fontSize: "1.25rem" }}
          color="dimmed"
          component="h2"
          weight={400}>
          Stories
        </Text>
        <Button
          size="sm"
          component={NextLink}
          href="/stories"
          variant="outline"
          rightIcon={<ArrowRight size={16} />}>
          All Stories
        </Button>
      </Group>
      <Carousel
        align="center"
        height="100%"
        slideGap={4}
        slideSize="93%"
        controlSize={25}
        sx={{ maxWidth: "100%" }}
        nextControlIcon={
          <ThemeIcon
            size="md"
            variant="filled"
            color="indigo"
            radius="xl"
            sx={(theme) => ({
              boxShadow: theme.shadows.md,
            })}>
            <ChevronRight size={18} />
          </ThemeIcon>
        }
        previousControlIcon={
          <ThemeIcon
            size="md"
            variant="filled"
            color="indigo"
            radius="xl"
            sx={(theme) => ({
              boxShadow: theme.shadows.md,
            })}>
            <ChevronLeft size={18} />
          </ThemeIcon>
        }
        styles={{
          control: {
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
          },
        }}>
        {stories.map((story) => (
          <Carousel.Slide key={story.slug}>
            <StoryCard data={story} showChapterCount />
          </Carousel.Slide>
        ))}
        <Carousel.Slide>
          <Box className={classes.extraCard}>
            <Image src={artwork} alt="artwork" height={400} />
            <Text size="md" align="center" color="indigo" weight="bold">
              Want to feature your story here?
            </Text>
            <Button
              component={NextLink}
              href="/submissions"
              size="md"
              fullWidth
              color="indigo"
              mt="md">
              Request Submission
            </Button>
          </Box>
        </Carousel.Slide>
      </Carousel>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  extraCard: {
    height: "100%",
    width: "100%",
    marginLeft: "2px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray[8],
  },
}));
