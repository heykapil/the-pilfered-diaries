import { Burger, Button, Drawer, Group, Header, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { APP_TITLE } from "../constants/app.constants";
import { useMediaMatch } from "../hooks/isMobile";

function Nav() {
  const { pathname } = useRouter();
  const isMobile = useMediaMatch();

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Header
        height={60}
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          padding: theme.spacing.sm,
          flexGrow: 0,
        })}>
        <Text component={NextLink} href="/" weight="bold" size="xl">
          {APP_TITLE}
        </Text>
        {isMobile ? (
          <Burger opened={open} onClick={toggleDrawer} ml="auto" size="sm" />
        ) : (
          <Group ml="auto">
            <Button
              component={NextLink}
              href="/stories"
              variant={pathname === "/stories" ? "gradient" : "subtle"}
              gradient={{ from: "orange", to: "red" }}>
              Stories & Narratives
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
        </Group>
      </Drawer>
    </>
  );
}

export default Nav;
