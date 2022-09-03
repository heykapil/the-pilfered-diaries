import { Text, useMantineTheme } from "@mantine/core";
import React from "react";

export default function TagsList({ tags = [] }) {
  const { colors } = useMantineTheme();
  return (
    <Text
      my={4}
      color={colors.indigo[4]}
      component="p"
      m={0}
      sx={{ lineHeight: 1 }}
      size="xs">
      {tags.map((tag) => (
        <Text component="span" key={tag}>
          #{tag}{" "}
        </Text>
      ))}
    </Text>
  );
}
