import {
  ActionIcon,
  Box,
  Button,
  Container,
  createStyles,
  Group,
  Input,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import React, { useRef, useState } from "react";
import readingTime from "reading-time";
import { X } from "tabler-icons-react";
import RenderMarkdown from "../components/markdown/RenderMarkdown";
import { AVG_READING_SPEED } from "../constants/app.constants";

export default function FilePreview() {
  const [fileData, setFileData] = useState(null);
  const ref = useRef();
  const { classes } = useStyles();

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
          setFileData({
            content,
            data,
            file,
            readTime: readingTime(fileContent, {
              wordsPerMinute: AVG_READING_SPEED,
            }),
          });
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
        <Box className={classes.wrapper}>
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
          <Box className={classes.frontMatter}>
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
          <Box className={classes.frontMatter}>
            <Text align="center">
              {fileData.readTime.text} ({fileData.readTime.words} words)
            </Text>
          </Box>
          <RenderMarkdown {...fileData.content} />
        </Box>
      )}
    </Container>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.gray[9],
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.md,
  },
  frontMatter: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.gray[8],
    marginBottom: theme.spacing.md,
  },
}));
