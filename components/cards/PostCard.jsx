import { Box, createStyles, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Point } from "tabler-icons-react";
import { DATE_FORMATS } from "../../constants/app.constants";
import TagsList from "../shared/TagsList";

export default function PostCard({ data }) {
  const { classes } = useStyles();
  return (
    <Group
      className={classes.wrapper}
      align="flex-start"
      spacing={8}
      noWrap
      component={NextLink}
      href={`/posts/${data.slug}`}>
      <Box sx={{ flexShrink: 0 }}>
        <Image
          className={classes.image}
          width={112}
          height={112}
          src={data.thumbnail}
          alt={`${data.slug}-thumbnail`}
        />
      </Box>
      <Box py={8} pr={8}>
        <Text
          weight="bold"
          sx={(theme) => ({ color: theme.colors.gray[4] })}
          component="h3"
          my={0}>
          {data.title}
        </Text>
        <Text
          size="xs"
          sx={(theme) => ({ color: theme.colors.gray[4], lineHeight: 1.3 })}
          lineClamp={1}>
          {data.excerpt}
        </Text>
        <Text color="dimmed" size="xs" mt={6}>
          {dayjs(data.published).format(DATE_FORMATS.date)}
          <Point size={8} style={{ margin: "0px 4px" }} />
          {data.author}
        </Text>
        <TagsList tags={data.tags} />
      </Box>
    </Group>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginBottom: theme.spacing.sm,
    textDecoration: "none",
    backgroundColor: theme.colors.gray[8],
    borderRadius: theme.radius.md,
    maxHeight: "100px",
    minHeight: "7rem",
  },
  image: {
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
  },
}));
