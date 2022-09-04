import {
  ActionIcon,
  Box,
  createStyles,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import {
  BrandFirebase,
  BrandGithub,
  BrandInstagram,
  BrandLinkedin,
  BrandNextjs,
  Copyright,
} from "tabler-icons-react";
import { APP_TITLE, INSTA_LINK } from "../constants/app.constants";
import { useMediaMatch } from "../hooks/isMobile";

export default function Footer() {
  const { classes } = useStyles();
  const isMobile = useMediaMatch();

  return (
    <>
      <Box className={classes.footer}>
        <Copyright size={20} />
        <Text size="xs" weight={500} ml={-4}>
          {APP_TITLE}
        </Text>
        <Group ml="auto" spacing={isMobile ? 6 : "md"}>
          <Tooltip label="Instagram: Amittras Pal">
            <ActionIcon
              component={NextLink}
              href={INSTA_LINK}
              target="_blank"
              variant="light"
              radius="xl"
              color="grape">
              <BrandInstagram size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="LinkedIn: Amittras Pal">
            <ActionIcon
              component={NextLink}
              href="https://linkedin.com/in/amittras-pal"
              target="_blank"
              variant="light"
              radius="xl"
              color="blue">
              <BrandLinkedin size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="View Source on Github">
            <ActionIcon
              variant="light"
              radius="xl"
              component={NextLink}
              href="https://github.com/amittras-pal/the-pilfered-diaries"
              target="_blank"
              color="green">
              <BrandGithub size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Powered by Firebase">
            <ActionIcon
              variant="light"
              radius="xl"
              component={NextLink}
              href="https://firebase.google.com/"
              target="_blank"
              color="yellow">
              <BrandFirebase size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Built on Next.JS">
            <ActionIcon
              variant="light"
              radius="xl"
              component={NextLink}
              href="https://nextjs.org/"
              target="_blank"
              color="gray">
              <BrandNextjs size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  footer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.xs,
    borderTop: `1px solid ${theme.colors.gray[9]}`,
  },
}));
