import {
  Burger,
  Button,
  createStyles,
  Drawer,
  Group,
  Header,
  Text,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { APP_TITLE } from "../constants/app.constants";
import { useMediaMatch } from "../hooks/isMobile";

function Nav() {
  const { pathname } = useRouter();
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Header height={60} className={classes.header}>
        <Text
          component={NextLink}
          href="/"
          weight="bold"
          size="xl"
          color="gray">
          {APP_TITLE}
        </Text>
        {isMobile ? (
          <Burger
            opened={open}
            onClick={toggleDrawer}
            ml="auto"
            size="sm"
            color="gray"
          />
        ) : (
          <Group ml="auto">
            <Button
              component={NextLink}
              href="/stories"
              color="indigo"
              variant={pathname === "/stories" ? "filled" : "subtle"}>
              Stories & Narratives
            </Button>
            <Button
              component={NextLink}
              href="/submissions"
              color="indigo"
              variant={pathname === "/submissions" ? "filled" : "subtle"}>
              Submit your post
            </Button>
          </Group>
        )}
      </Header>
      <Drawer
        position="right"
        opened={open}
        onClose={toggleDrawer}
        withCloseButton
        title={APP_TITLE}
        size="md"
        padding="md">
        <Group mt={"2rem"}>
          <Button
            component={NextLink}
            href="/stories"
            fullWidth
            variant={pathname === "/stories" ? "gradient" : "subtle"}
            onClick={toggleDrawer}
            gradient={{ from: "orange", to: "red" }}>
            Stories & Narratives
          </Button>
          <Button
            component={NextLink}
            href="/submissions"
            fullWidth
            variant={pathname === "/submissions" ? "gradient" : "subtle"}
            onClick={toggleDrawer}
            gradient={{ from: "orange", to: "red" }}>
            Submit your post
          </Button>
        </Group>
      </Drawer>
    </>
  );
}

export default Nav;

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    position: "fixed",
    top: "0",
    alignItems: "center",
    padding: theme.spacing.sm,
    flexGrow: 0,
    boxShadow: theme.shadows.sm,
    // backgroundColor: "transparent",
    backgroundColor: `${theme.white}0F`,
    borderColor: "transparent",
    backdropFilter: "blur(10px)",
  },
}));
