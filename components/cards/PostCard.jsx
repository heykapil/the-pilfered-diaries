import { Badge, Box, createStyles, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Point } from "tabler-icons-react";
import { DATE_FORMATS } from "../../constants/app.constants";

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
          width={112}
          height={112}
          src={data.thumbnail}
          alt={`${data.slug}-thumbnail`}
        />
      </Box>
      <Box py={8} pr={8}>
        <Text weight="bold" color="dark" component="h3" my={0}>
          {data.title}
        </Text>
        <Text size="xs" color="dark" lineClamp={1} sx={{ lineHeight: 1.3 }}>
          {data.excerpt}
        </Text>
        <Text color="dimmed" size="xs" mt={6}>
          {dayjs(data.published).format(DATE_FORMATS.date)}
          <Point size={8} style={{ margin: "0px 4px" }} />
          {data.author}
        </Text>
        <Group spacing={4} mt={8}>
          {data.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} size="xs" color="indigo">
              {tag}
            </Badge>
          ))}
        </Group>
      </Box>
    </Group>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginBottom: theme.spacing.sm,
    textDecoration: "none",
    backgroundColor: theme.white,
    maxHeight: "100px",
    minHeight: "7rem",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      boxShadow: theme.shadows.md,
    },
  },
}));
