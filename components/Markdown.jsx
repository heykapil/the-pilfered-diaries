import { components } from "@components/md";
import { handleFragmentNavigation } from "@lib/utils";
import { MDXRemote } from "next-mdx-remote";
import React, { forwardRef, useEffect, useRef } from "react";
import styles from "../styles/modules/Markdown.module.scss";

/**
 * @param {Object} props
 * @param {'light' | 'dark'} theme
 * @param {number} fontSize
 */
function Markdown({ theme, fontSize, ...mdxProps }, ref) {
  const contentRef = useRef();

  useEffect(() => {
    const fragmentLinks = [];
    const mdContent = contentRef.current;
    if (mdContent) {
      mdContent.querySelectorAll("a").forEach((link) => {
        if (link.getAttribute("href").startsWith("#")) fragmentLinks.push(link);
      });
      fragmentLinks.forEach((link) => {
        link.addEventListener("click", handleFragmentNavigation);
      });
    }

    return () => {
      if (mdContent && fragmentLinks.length > 0)
        fragmentLinks.forEach((link) => {
          link.removeEventListener("click", handleFragmentNavigation);
        });
    };
  }, []);

  return (
    <div className={`container-fluid ${styles.md} ${theme}`} ref={ref}>
      <div
        className="container"
        style={{ fontSize: `${fontSize}px` }}
        ref={contentRef}
      >
        <MDXRemote {...mdxProps} components={components} />
      </div>
    </div>
  );
}

export default forwardRef(Markdown);
