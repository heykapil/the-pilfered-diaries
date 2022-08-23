import { Box, Button, createStyles, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import { ChevronRight } from "tabler-icons-react";

function ChapterCard({ data, storyName }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.card}>
      <Text
        size="lg"
        weight="bold"
        color="indigo"
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

export default ChapterCard;

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: "#fff",
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.md,
    borderColor: "transparent",
    borderWidth: "1px",
    borderStyle: "solid",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: theme.colors.indigo[5],
    },
  },
}));
