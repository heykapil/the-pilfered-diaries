import { IconPoint } from "@tabler/icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DATE_FORMATS } from "../../constants/app.constants";
import TagsList from "../tagsList/TagsList";
import styles from "./ContentCards.module.scss";
import { useMediaQuery } from "../../hooks/media-query";

export default function PostSmall({ post }) {
  const isLargeScreen = useMediaQuery("md");
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
        <TagsList tags={post.tags} showCount={isLargeScreen ? 3 : 2} />
      </div>
    </Link>
  );
}
