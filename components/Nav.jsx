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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { APP_TITLE } from "../constants/app.constants";
import { useMediaMatch } from "../hooks/isMobile";

export default function Nav() {
  const { pathname } = useRouter();
  const isMobile = useMediaMatch();
  const { classes, cx } = useStyles();
  const { colors } = useMantineTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollHandler = (e) => {
      const containerPosition = e.target.scrollingElement.scrollTop;
      if (containerPosition >= 250) setScrolled(true);
      else setScrolled(false);
    };
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const [open, setOpen] = useState(false);
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
        <Text
          component={NextLink}
          href="/"
          size="lg"
          weight={500}
          color={scrolled ? colors.gray[8] : colors.gray[6]}>
          {APP_TITLE}
        </Text>
        <Burger
          opened={open}
          onClick={toggleDrawer}
          ml="auto"
          size="sm"
          color="gray"
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
            href="/stories"
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
    boxShadow: theme.shadows.sm,
    borderColor: "transparent",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease-in-out",
  },
  scrolled: {
    backgroundColor: `${theme.colors.gray[2]}CC`,
    height: 50,
  },
  unscrolled: {
    backgroundColor: `${theme.white}0F !important`,
    height: 70,
  },
}));
