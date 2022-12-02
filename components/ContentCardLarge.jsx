import Tag from "@components/Tag";
import { DATE_FORMATS, GUEST_POST_MARKER_TEXT } from "@constants/app";
import { IconPoint } from "@tabler/icons";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../styles/modules/ContentCards.module.scss";

const TagsList = dynamic(() => import("./TagsList"), {
  ssr: false,
});

export default function ContentCardLarge({ data, variant }) {
  return (
    <div className={`shadow card ${styles.lg}`}>
      {data.byGuest && (
        <div className={`shadow-md ${styles.lg__gtag}`}>
          <p className="mb-0 small">{GUEST_POST_MARKER_TEXT}</p>
        </div>
      )}
      <div className={styles.lg__imgbox}>
        <Link href={`/${variant}/${data.slug}`}>
          <Image
            src={data.cover}
            alt={data.slug + "-cover"}
            width={960}
            height={540}
            className={`card-img-top ${styles.lg__img}`}
          />
        </Link>
      </div>
      <div className={styles.lg__content}>
        <p className="mb-2 d-flex justify-content-between align-items-center gap-1">
          <Link
            href={`/${variant}/${data.slug}`}
            className="h4 mb-0 text-decoration-none"
          >
            {data.title}
          </Link>
          {variant === "stories" && data.wip && (
            <Tag>
              <IconPoint size={12} /> <span className="ms-1">Ongoing</span>
            </Tag>
          )}
        </p>
        <p className="text-light small mb-2">
          {dayjs(data.published).format(DATE_FORMATS.date)}
          <span className="mx-1">
            <IconPoint size={12} />
          </span>
          {data.author}
          {variant === "stories" && (
            <>
              <span className="mx-1">
                <IconPoint size={12} />
              </span>
              {data.chapterSlugs.length} Chapters
            </>
          )}
        </p>
        <div className="mb-2">
          <TagsList tags={data.tags} />
        </div>
        <p className="text-muted small mb-0">{data.excerpt}</p>
      </div>
    </div>
  );
}
