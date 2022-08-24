import { Box, createStyles } from "@mantine/core";
import React from "react";

export default function PostCard() {
  const { classes } = useStyles();
  return <Box className={classes.wrapper}>PostCard</Box>;
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: `1px solid ${theme.colors.gray[4]}`,
    borderRadius: theme.radius.md,
    backgroundColor: "#fff",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    minHeight: "7rem",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      border: `1px solid ${theme.colors.indigo[4]}`,
      boxShadow: theme.shadows.md,
    },
  },
}));
