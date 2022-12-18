import { DATE_FORMATS } from "@constants/app";
import { IconPoint } from "@tabler/icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React, { lazy, Suspense } from "react";
import styles from "../styles/modules/ContentCards.module.scss";

const TagsList = lazy(() => import("./TagsList"));

export default function PostSmall({ post }) {
  return (
    <div className={styles.sm} key={post.slug}>
      <Link href={`/posts/${post.slug}`}>
        <Image src={post.thumbnail} width={112} height={112} alt={post.slug} />
      </Link>
      <div className={`px-3 py-2 ${styles.sm__content}`}>
        <Link
          className="h4 mb-1 text-decoration-none"
          href={`/posts/${post.slug}`}
        >
          {post.title}
        </Link>
        <p className="small text-light text-truncate mb-2">{post.excerpt}</p>
        <p className="small text-muted mb-2">
          {dayjs(post.published).format(DATE_FORMATS.date)}
          <IconPoint size={8} style={{ margin: "0px 4px" }} />
          {post.author}
        </p>
        <Suspense fallback="...">
          <TagsList tags={post.tags} />
        </Suspense>
      </div>
    </div>
  );
}
