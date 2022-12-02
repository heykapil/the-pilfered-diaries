import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/modules/TagsList.module.scss";

export default function TagsList({ tags = [] }) {
  const tagsContainer = useRef();
  const resizeObserver = useRef();
  const [hidden, setHidden] = useState([]);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(([container]) => {
      const containerPosition = container.target.getBoundingClientRect().bottom;
      const hiddenTags = [];

      container.target.childNodes.forEach((node) => {
        if (node.getBoundingClientRect().top >= containerPosition)
          hiddenTags.push(node.textContent);
      });
      setHidden(hiddenTags);
    });
  });

  useEffect(() => {
    const tagsList = tagsContainer.current;
    const observer = resizeObserver.current;
    if (tagsList) observer.observe(tagsList);

    return () => {
      if (tagsList) observer.unobserve(tagsList);
    };
  }, []);

  useEffect(() => {
    const { Tooltip } = require("bootstrap");
    const tooltips = [].slice.call(
      document.querySelectorAll('.badge[data-bs-toggle="tooltip"]')
    );
    tooltips.map((trigger) => new Tooltip(trigger));
    return () => {
      document.querySelectorAll(".tooltip.show").forEach((node) => {
        node.remove();
      });
    };
  }, [hidden]);

  return (
    <div className={styles.tags}>
      <div className={styles.tags__list} ref={tagsContainer}>
        {tags.map((tag) => (
          <div className={`badge ${styles.tags__item}`} key={tag}>
            {tag}
          </div>
        ))}
      </div>
      {hidden.length > 0 && (
        <div
          className={`badge ${styles.tags__item} ${styles.tags__active}`}
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          data-bs-offset="0,5"
          data-bs-html="true"
          title={hidden.join(", ")}
        >
          + {hidden.length}
        </div>
      )}
    </div>
  );
}
