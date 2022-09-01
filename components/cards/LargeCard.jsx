import { Badge, Box, Group, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Point } from "tabler-icons-react";
import { DATE_FORMATS } from "../../constants/app.constants";
import useLargeCardStyles from "../../styles/largeCard.styles";

export default function LargeCard({ variant = "stories", data }) {
  const { classes } = useLargeCardStyles();
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
          {variant === "stories" && (
            <Point size={8} style={{ margin: "0px 4px" }} />
          )}
          {variant === "stories" ? `${data.chapterCount} Chapters` : ""}
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
          href={`/${variant}/${data.slug}`}
          weight="bold"
          align="end">
          Read Now...
        </Text>
      </Box>
    </Box>
  );
}
