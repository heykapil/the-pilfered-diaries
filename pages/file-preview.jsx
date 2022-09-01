import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Input,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import React, { useRef, useState } from "react";
import { X } from "tabler-icons-react";
import RenderMarkdown from "../components/markdown/RenderMarkdown";

export default function FilePreview() {
  const [fileData, setFileData] = useState(null);
  const ref = useRef();

  const handleFile = (e) => {
    const allowedExtensions = [".md", ".mdx"];
    const file = e.target.files[0];
    if (file) {
      const fileType = file.name.slice(file.name.lastIndexOf("."));
      if (!allowedExtensions.includes(fileType)) {
        showNotification({
          title: "Invalid File Type",
          message: "Only markdown files can be previewed.",
          color: "red",
          icon: <X size={18} />,
        });
        return;
      } else {
        const reader = new FileReader();
        reader.onloadend = async (e) => {
          const { content: fileContent, data } = grayMatter(e.target.result);
          const content = await serialize(fileContent);
          setFileData({ content, data, file });
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <Container pt={70}>
      <Input
        type="file"
        multiple={false}
        onChange={handleFile}
        ref={ref}
        sx={{ display: "none" }}
      />
      <Button
        variant="light"
        color="gray"
        onClick={() => ref.current.click()}
        fullWidth>
        {fileData ? "Change File" : "Click to Open File"}
      </Button>
      {fileData && (
        <Box
          sx={(theme) => ({
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.xl,
            backgroundColor: theme.colors.gray[9],
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.md,
          })}>
          <Group position="apart" align="center" mb="md">
            <Text weight={500}>{fileData.file?.name}</Text>
            <ActionIcon
              variant="outline"
              onClick={() => {
                setFileData(null);
                ref.current.value = null;
              }}
              ml="auto"
              radius="xl"
              size="sm">
              <X size={16} />
            </ActionIcon>
          </Group>
          <Box
            mb="md"
            sx={(theme) => ({
              padding: theme.spacing.sm,
              borderRadius: theme.radius.sm,
              backgroundColor: theme.colors.gray[8],
            })}>
            {Object.entries(fileData.data).map(([key, value]) => (
              <Box component="div" key={key}>
                <Text size="sm" weight="bold" component="span">
                  {key}:{" "}
                </Text>
                <Text size="sm" color="dimmed" component="span">
                  {value}
                </Text>
              </Box>
            ))}
          </Box>
          <RenderMarkdown {...fileData.content} />
        </Box>
      )}
    </Container>
  );
}
