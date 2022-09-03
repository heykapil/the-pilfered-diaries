import { Box, createStyles, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Point } from "tabler-icons-react";
import { DATE_FORMATS } from "../../constants/app.constants";
import { useMediaMatch } from "../../hooks/isMobile";
import TagsList from "../shared/TagsList";

export default function LargeCard({ variant = "stories", data }) {
  const { classes } = useStyles();
  const isMobile = useMediaMatch();
  return (
    <Box className={classes.wrapper}>
      <Image
        src={data.cover}
        className={classes.image}
        width={1280}
        height={720}
        alt={data.slug + "-cover"}
      />
      <Box px="xs" py="xs" className={classes.detailsContainer}>
        {data.byGuest && (
          <Box className={classes.guestMarker}>
            <Text size="sm">Submitted by a Guest</Text>
          </Box>
        )}
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
        <TagsList tags={data.tags} />
        <Text size="sm" lineClamp={isMobile ? 3 : 2}>
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

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.gray[8],
    borderRadius: theme.radius.md,
  },
  guestMarker: {
    position: "absolute",
    top: -18,
    left: 0,
    fontWeight: 500,
    padding: `0px ${theme.spacing.xs}px`,
    color: theme.white,
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    backgroundColor: `${theme.colors.indigo[5]}EF`,
  },
  image: {
    borderTopRightRadius: theme.radius.md,
    borderTopLeftRadius: theme.radius.md,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    position: "relative",
  },
}));
