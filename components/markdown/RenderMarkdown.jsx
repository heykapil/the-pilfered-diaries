import { MDXRemote } from "next-mdx-remote";
import React from "react";
import styles from "./Markdown.module.scss";
import { components } from "./mdComponents";

function RenderMarkdown(props) {
  return (
    <div className={styles.markdown}>
      <MDXRemote {...props} components={components} />
    </div>
  );
}

export default RenderMarkdown;
