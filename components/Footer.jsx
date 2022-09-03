import {
  ActionIcon,
  Box,
  createStyles,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Image from "next/image";
import React from "react";
import { BrandInstagram, BrandLinkedin, Copyright } from "tabler-icons-react";
import { APP_TITLE, INSTA_LINK } from "../constants/app.constants";
import firebaseLogo from "../resources/images/firebase-logo.svg";
import mantineLogo from "../resources/images/mantine-logo.svg";
import nextLogo from "../resources/images/next-logo.svg";
import { useMediaMatch } from "../hooks/isMobile";

export default function Footer() {
  const { classes } = useStyles();
  const isMobile = useMediaMatch();
  const { colors } = useMantineTheme();

  return (
    <>
      <Box className={classes.footerTop}>
        <Copyright size={18} />
        <Text size="xs">{APP_TITLE} 2022</Text>
        <Group ml="auto" spacing="xs">
          <Tooltip label="Instagram: Amittras Pal">
            <ActionIcon
              component={NextLink}
              href={INSTA_LINK}
              target="_blank"
              variant="subtle"
              radius="xl"
              color="grape"
              size={isMobile ? "sm" : "lg"}>
              <BrandInstagram />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="LinkedIn: Amittras Pal">
            <ActionIcon
              component={NextLink}
              href="https://linkedin.com/in/amittras-pal"
              target="_blank"
              variant="subtle"
              radius="xl"
              color="blue"
              size={isMobile ? "sm" : "lg"}>
              <BrandLinkedin />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>
      <Box className={classes.footerBottom}>
        <Text color={colors.indigo[3]} mb={3}>
          Built with
        </Text>
        <Tooltip label="Firebase">
          <Box
            component={NextLink}
            href="https://firebase.google.com/"
            target="_blank">
            <Image
              src={firebaseLogo}
              width={24}
              height={24}
              alt="firebase logo"
            />
          </Box>
        </Tooltip>
        <Tooltip label="Next.JS">
          <Box component={NextLink} href="https://nextjs.org/" target="_blank">
            <Image src={nextLogo} width={24} height={24} alt="next logo" />
          </Box>
        </Tooltip>
        <Tooltip label="Mantine UI">
          <Box component={NextLink} href="https://mantine.dev/" target="_blank">
            <Image
              src={mantineLogo}
              width={24}
              height={24}
              alt="mantine logo"
            />
          </Box>
        </Tooltip>
      </Box>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  footerTop: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.xs,
    borderTop: `1px solid ${theme.colors.gray[9]}`,
  },
  footerBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
}));
