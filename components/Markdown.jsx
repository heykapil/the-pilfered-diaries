import { MDXRemote } from "next-mdx-remote";
import React, { forwardRef } from "react";
import styles from "../styles/modules/Markdown.module.scss";
import { components } from "@components/md";

/**
 * @param {Object} props
 * @param {'light' | 'dark'} theme
 * @param {number} fontSize
 */
function Markdown({ theme, fontSize, ...mdxProps }, ref) {
  return (
    <div className={`container-fluid ${styles.md} ${theme}`} ref={ref}>
      <div className="container" style={{ fontSize: `${fontSize}px` }}>
        <MDXRemote {...mdxProps} components={components} />
      </div>
    </div>
  );
}

export default forwardRef(Markdown);
