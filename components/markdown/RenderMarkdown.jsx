import { Box, createStyles } from "@mantine/core";
import { MDXRemote } from "next-mdx-remote";
import React from "react";
import { mdCompoents } from "./mdComponents";

export default function RenderMarkdown(props) {
  const { classes } = useStyles();

  return (
    <Box className={classes.markdownContent}>
      <MDXRemote {...props} components={mdCompoents} />
    </Box>
  );
}

const useStyles = createStyles((theme) => ({
  markdownContent: {
    fontFamily: "'Lato', sans-serif",
    "p, h1, h2, h3, h4, h5, h6, ul": {
      marginTop: 0,
    },
    p: {
      marginBottom: theme.spacing.md,
    },
    a: {
      textDecoration: "none",
      color: theme.colors.indigo[3],
      opacity: 0.8,
      transition: "opacity 0.2s ease-in-out",
      "&:hover, &:focus": {
        opacity: 1,
        fontWeight: 500,
        textDecoration: "underline",
      },
    },
    img: {
      width: "100%",
      height: "auto",
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.md,
    },
  },
}));
