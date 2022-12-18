import Tag from "@components/Tag";
import { DATE_FORMATS, GUEST_POST_MARKER_TEXT } from "@constants/app";
import { useMediaQuery } from "@hooks/media-query";
import { IconPoint } from "@tabler/icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React, { lazy, Suspense } from "react";
import styles from "../styles/modules/ContentCards.module.scss";

const TagsList = lazy(() => import("./TagsList"));

export default function ContentCardLarge({ data, variant }) {
  const isLargeScreen = useMediaQuery("md");
  return (
    <div className={`shadow card ${styles.lg}`}>
      {data.byGuest && (
        <div className={`shadow-md ${styles.lg__gtag}`}>
          <p className="mb-0 small">{GUEST_POST_MARKER_TEXT}</p>
        </div>
      )}
      <Link
        href={`/${variant}/${data.slug}`}
        className={styles.lg__imgbox}
        style={{ height: isLargeScreen ? "240px" : "200px" }}
      >
        <Image
          src={data.cover}
          alt={data.slug + "-cover"}
          width={960}
          height={540}
          className={`card-img-top ${styles.lg__img}`}
        />
      </Link>
      <div className={styles.lg__content}>
        <p className="mb-2 d-flex justify-content-between align-items-center gap-1">
          <Link href={`/${variant}/${data.slug}`} className="h4 mb-0">
            <span>{data.title}</span>
          </Link>
          {variant === "stories" && data.wip && (
            <Tag>
              <IconPoint size={12} /> <span className="ms-1">Ongoing</span>
            </Tag>
          )}
        </p>
        <p className={`mb-${variant === "stories" ? "0" : "2"} small`}>
          <span className="text-muted">Published:</span>{" "}
          {dayjs(data.published).format(DATE_FORMATS.date)}, by {data.author}
        </p>
        {variant === "stories" && (
          <>
            <p
              className={`mb-${
                data.wip && data.chapterSlugs.length > 1 ? "0" : "2"
              } small`}
            >
              <span className="text-muted">Chapters:</span>{" "}
              {data.chapterSlugs.length}
            </p>
            {data.wip && data.chapterSlugs.length > 1 && (
              <p className="mb-2 small">
                <span className="text-muted">Lastest chapter added:</span>{" "}
                {dayjs(data.lastUpdated).format(DATE_FORMATS.date)}
              </p>
            )}
          </>
        )}
        <div className="mb-2">
          <Suspense fallback="...">
            <TagsList tags={data.tags} />
          </Suspense>
        </div>
        <p className="text-muted small mb-0">{data.excerpt}</p>
      </div>
    </div>
  );
}
