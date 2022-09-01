import { Box, createStyles, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";

export default function ChapterCard({ data, storyName }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.card}>
      <Text
        size="lg"
        weight="bold"
        sx={(theme) => ({ color: theme.colors.gray[4] })}
        variant="link"
        component={NextLink}
        href={`/stories/${storyName}/${data.slug}`}>
        {data.title}
      </Text>
      <Text size="sm" color="dimmed" mt="sm">
        {data.excerpt}
      </Text>
    </Box>
  );
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.gray[8],
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderColor: "transparent",
    borderWidth: "1px",
    borderStyle: "solid",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: theme.colors.gray[6],
      boxShadow: theme.shadows.md,
    },
  },
}));
