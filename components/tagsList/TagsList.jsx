import React, { useMemo } from "react";

export default function TagsList({ tags, showCount = "all" }) {
  const { showingTags, remaining } = useMemo(() => {
    if (showCount === "all")
      return {
        showingTags: [...tags],
        remaining: 0,
      };
    return {
      showingTags: tags.slice(0, showCount),
      remaining: tags.length > showCount ? tags.length - showCount : 0,
    };
  }, [showCount, tags]);

  return (
    <p className="mb-0 d-flex flex-wrap gap-1 small">
      {showingTags.map((tag) => (
        <span className="badge post-tag" key={tag}>
          {tag}
        </span>
      ))}
      {remaining > 0 && <span className="badge post-tag">+ {remaining}</span>}
    </p>
  );
}
