import {
  Burger,
  Button,
  createStyles,
  Drawer,
  Group,
  Header,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { APP_TITLE, SMALL_THRESHOLD_ROUTES } from "../constants/app.constants";
import { useMediaMatch } from "../hooks/isMobile";
import logoWhite from "../resources/images/logo-white.svg";

export default function Nav() {
  const { pathname } = useRouter();
  const { classes, cx } = useStyles();
  const { white } = useMantineTheme();
  const isMobile = useMediaMatch();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const threshold = useMemo(() => {
    return SMALL_THRESHOLD_ROUTES.includes(pathname) ? 50 : 250;
  }, [pathname]);

  useEffect(() => {
    const scrollHandler = (e) => {
      const containerPosition = e.target.scrollingElement.scrollTop;
      if (containerPosition >= threshold) setScrolled(true);
      else setScrolled(false);
    };
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [threshold]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Header
        className={cx(classes.header, {
          [classes.scrolled]: scrolled,
          [classes.unscrolled]: !scrolled,
        })}>
        <Image
          width={40}
          height={40}
          alt="site-logo"
          src={logoWhite}
          style={{
            opacity: scrolled ? 0.5 : 1,
            transition: "opacity 0.2s ease-in-out",
          }}
        />
        <Text
          component={NextLink}
          href="/"
          size="lg"
          ml="sm"
          weight={500}
          color={scrolled ? "dimmed" : white}>
          {APP_TITLE}
        </Text>
        <Burger
          opened={open}
          onClick={toggleDrawer}
          ml="auto"
          size="sm"
          color={white}
        />
      </Header>
      <Drawer
        position="right"
        opened={open}
        onClose={toggleDrawer}
        withCloseButton
        title={APP_TITLE}
        size={isMobile ? "md" : "xl"}
        padding="md">
        <Group mt={"2rem"} spacing="sm" sx={{ flexDirection: "column" }}>
          <Button
            component={NextLink}
            href="/stories"
            fullWidth
            variant={pathname === "/stories" ? "outline" : "subtle"}
            onClick={toggleDrawer}>
            Stories & Narratives
          </Button>
          <Button
            component={NextLink}
            href="/posts"
            fullWidth
            variant={pathname === "/posts" ? "outline" : "subtle"}
            onClick={toggleDrawer}>
            Posts
          </Button>
          <Button
            component={NextLink}
            href="/submissions"
            fullWidth
            variant={pathname === "/submissions" ? "outline" : "subtle"}
            onClick={toggleDrawer}>
            Submit your Work
          </Button>
        </Group>
      </Drawer>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    position: "fixed",
    top: 0,
    alignItems: "center",
    padding: theme.spacing.sm,
    flexGrow: 0,
    borderColor: "transparent",
    transition: "all 0.3s ease-in-out",
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
    backdropFilter: "blur(10px)",
    backgroundColor: `${theme.colors.gray[8]}DF`,
    height: 50,
  },
  unscrolled: {
    backgroundColor: `transparent`,
    height: 70,
  },
}));
