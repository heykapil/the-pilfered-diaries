import { MDXRemote } from "next-mdx-remote";
import React from "react";
import styles from "../styles/modules/Markdown.module.scss";
import { components } from "@components/md";

function Markdown(props) {
  return (
    <div className={styles.markdown}>
      <MDXRemote {...props} components={components} />
    </div>
  );
}

export default Markdown;
