import { Divider, Group, Text } from "@mantine/core";
import React from "react";
import { Separator } from "tabler-icons-react";

export default function AuthorNoteSeparator() {
  return (
    <>
      <Divider
        mt="2.5rem"
        mb="0.75rem"
        labelPosition="center"
        label={
          <Group spacing={4}>
            <Separator size={8} />
            <Separator size={8} />
            <Separator size={8} />
            <Separator size={8} />
            <Separator size={8} />
          </Group>
        }
      />
      <Text weight="bold" color="dimmed" size="lg">
        Author&rsquo;s Note:
      </Text>
    </>
  );
}
