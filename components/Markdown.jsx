import { MDXRemote } from "next-mdx-remote";
import React from "react";
import styles from "../styles/modules/Markdown.module.scss";
import { components } from "@components/md";

/**
 * @param {Object} props
 * @param {import('react').HTMLAttributes} props.containerProps
 * @returns
 */
function Markdown({ containerProps, ...mdxProps }) {
  return (
    <div className={styles.md} {...containerProps}>
      <MDXRemote {...mdxProps} components={components} />
    </div>
  );
}

export default Markdown;
