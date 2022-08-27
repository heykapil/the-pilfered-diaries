import { Badge, Box, createStyles, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Point } from "tabler-icons-react";
import { DATE_FORMATS } from "../../constants/app.constants";

export default function PostCardLg({ data }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Image
        src={data.cover}
        width={1280}
        height={720}
        alt={data.slug + "-cover"}
      />
      <Box px="xs" py="xs" className={classes.detailsContainer}>
        <Text weight={500} size="xl" component="h3" mt={0} mb="sm">
          {data.title}
        </Text>
        <Text color="dimmed" size="xs">
          {dayjs(data.published).format(DATE_FORMATS.date)}
          <Point size={8} style={{ margin: "0px 4px" }} />
          {data.author}
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
          href={`/posts/${data.slug}`}
          weight="bold"
          align="end">
          Read Now...
        </Text>
      </Box>
    </Box>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: "1px solid transparent",
    transition: "all 0.2s ease-in-out",
    backgroundColor: "#fff",
    marginLeft: "2px",
    "&:hover": {
      boxShadow: theme.shadows.md,
      border: `1px solid ${theme.colors.indigo[4]}`,
    },
  },
  detailsContainer: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    color: theme.colors.gray[8],
  },
}));
