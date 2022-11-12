import { IconPoint } from "@tabler/icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DATE_FORMATS } from "../../constants/app.constants";
import styles from "./ContentCards.module.scss";

export default function PostSmall({ post }) {
  return (
    <Link
      className={styles["post-card-small"]}
      key={post.slug}
      href={`/posts/${post.slug}`}>
      <Image src={post.thumbnail} width={112} height={112} alt={post.slug} />
      <div className={`px-3 py-2 ${styles["post-card-small__content"]}`}>
        <h4 className="mb-1">{post.title}</h4>
        <p className="small text-light text-truncate mb-2">{post.excerpt}</p>
        <p className="small text-muted mb-2">
          {dayjs(post.published).format(DATE_FORMATS.date)}
          <IconPoint size={8} style={{ margin: "0px 4px" }} />
          {post.author}
        </p>
        <p className="small mb-0 d-flex flex-wrap gap-1">
          {post.tags.slice(0, 2).map((tag) => (
            <span className="badge post-tag" key={tag}>
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="badge post-tag">+ {post.tags.length - 2}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
