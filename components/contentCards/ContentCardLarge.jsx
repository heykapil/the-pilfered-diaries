import { IconPoint } from "@tabler/icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DATE_FORMATS } from "../../constants/app.constants";
import TagsList from "../tagsList/TagsList";
import styles from "./ContentCards.module.scss";

export default function ContentCardLarge({ data, variant }) {
  return (
    <Link
      href={`/${variant}/${data.slug}`}
      className={`shadow card ${styles["content-card-large"]}`}>
      {data.byGuest && (
        <div
          className={`shadow-md ${styles["content-card-large__guest-marker"]}`}>
          <p className="mb-0 small">Submitted By Guest</p>
        </div>
      )}
      <div className={styles["content-card-large__img-container"]}>
        <Image
          src={data.cover}
          alt={data.slug + "-cover"}
          width={960}
          height={540}
          className={`card-img-top ${styles["content-card-large__img"]}`}
        />
      </div>
      <div className={styles["content-card-large__content"]}>
        <h4 className="mb-1">{data.title}</h4>
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
              {data.chapterCount} Chapters
            </>
          )}
        </p>
        <TagsList tags={data.tags} showCount={4} />
        <p className="text-muted small mb-0">{data.excerpt}</p>
      </div>
    </Link>
  );
}
