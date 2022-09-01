import { Divider, Group } from "@mantine/core";
import React from "react";
import { Point } from "tabler-icons-react";

export default function SectionBreak() {
  return (
    <Divider
      color="indigo"
      my="lg"
      mx="25%"
      variant="dashed"
      labelPosition="center"
      label={
        <Group spacing={4}>
          <Point size={8} />
          <Point size={8} />
          <Point size={8} />
        </Group>
      }
    />
  );
}
