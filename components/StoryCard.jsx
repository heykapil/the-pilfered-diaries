import { Box, createStyles, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { Point } from "tabler-icons-react";
import dayjs from "dayjs";
import React from "react";
import Image from "next/image";

function StoryCard({ meta, showChapterCount = false }) {
  const { classes } = useStyles();
  return (
    <Box
      className={classes.wrapper}
      component={NextLink}
      href={`/stories/${meta.slug}`}>
      <Image
        className={classes.coverImg}
        src={meta.headerImg}
        width={1280}
        height={720}
        alt={meta.slug}
      />
      <Text weight={500} size="xl">
        {meta.title}
      </Text>
      <Text color="dimmed" size="xs" mb="1rem">
        {dayjs(meta.date).format("MMM DD, YYYY")}
        <Point size={8} style={{ margin: "0px 4px" }} />
        {meta.author}
        {showChapterCount && (
          <>
            <Point size={8} style={{ margin: "0px 4px" }} />
            {meta.chapterCount} Chapters
          </>
        )}
      </Text>

      <Text size="sm" lineClamp={4}>
        {meta.excerpt}
      </Text>
    </Box>
  );
}

export default StoryCard;

const useStyles = createStyles((theme) => ({
  wrapper: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    color: theme.colors.gray[8],
    textDecoration: "none",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#fff",
      color: theme.colors.orange[8],
      boxShadow: theme.shadows.lg,
    },
  },
  coverImg: {
    borderRadius: theme.radius.sm,
  },
}));
