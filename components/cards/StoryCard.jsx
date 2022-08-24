import { Badge, Box, createStyles, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Point } from "tabler-icons-react";

function StoryCard({ data }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Image
        className={classes.coverImg}
        src={data.cover}
        width={1280}
        height={720}
        alt={data.slug + "-cover"}
      />
      <Box px="xs" py="xs" className={classes.detailsContainer}>
        <Text weight={500} size="xl">
          {data.title}
        </Text>
        <Text color="dimmed" size="xs">
          {dayjs(data.published).format("MMM DD, YYYY")}
          <Point size={8} style={{ margin: "0px 4px" }} />
          {data.author}
          <Point size={8} style={{ margin: "0px 4px" }} />
          {data.chapterCount} Chapters
        </Text>
        <Group spacing={4} my="sm">
          {data.tags.map((tag) => (
            <Badge key={tag} color="indigo" variant="light" size="xs">
              {tag}
            </Badge>
          ))}
        </Group>
        <Text size="sm" lineClamp={4}>
          {data.excerpt}
        </Text>
        <Text
          size="sm"
          variant="link"
          ml="auto"
          mr="xs"
          mt="md"
          component={NextLink}
          href={`/stories/${data.slug}`}
          weight="bold"
          align="end">
          Read Now...
        </Text>
      </Box>
    </Box>
  );
}

export default StoryCard;

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: `1px solid ${theme.colors.gray[4]}`,
    transition: "all 0.2s ease-in-out",
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    "&:hover": {
      boxShadow: theme.shadows.md,
      border: `1px solid ${theme.colors.indigo[4]}`,
    },
  },
  coverImg: {
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    color: theme.colors.gray[8],
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
  },
}));
