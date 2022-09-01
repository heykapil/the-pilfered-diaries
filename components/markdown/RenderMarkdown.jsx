import { Blockquote } from "@mantine/core";
import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import React from "react";
import AuthorNoteSeparator from "./AuthorNoteSeparator";
import SectionBreak from "./SectionBreak";

export default function RenderMarkdown(props) {
  return (
    <MDXRemote
      {...props}
      components={{
        SectionBreak,
        AuthorNoteSeparator,
        Blockquote,
        Link,
      }}
    />
  );
}
