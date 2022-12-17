import Tag from "@components/Tag";
import { DATE_FORMATS } from "@constants/app";
import { useMediaQuery } from "@hooks/media-query";
import {
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconPoint,
} from "@tabler/icons";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useRef, useState } from "react";
import styles from "../../styles/modules/Home.module.scss";

const TagsList = dynamic(() => import("../TagsList"), {
  ssr: false,
});

export default function StoriesCarousel({ stories }) {
  const coverCarouselRef = useRef();
  const contentCarouselRef = useRef();
  const isDesktop = useMediaQuery("md");
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleCarousel = (dir) => {
    const { Carousel } = require("bootstrap");
    const coverCarousel = new Carousel(coverCarouselRef.current, {
      interval: false,
    });
    const contentCarousel = new Carousel(contentCarouselRef.current, {
      interval: false,
    });
    if (dir === "next") {
      setCurrentSlide((prev) => prev + 1);
      coverCarousel.next();
      setTimeout(() => contentCarousel.next(), 150);
    } else {
      setCurrentSlide((prev) => prev - 1);
      coverCarousel.prev();
      setTimeout(() => contentCarousel.prev(), 150);
    }
  };
  return (
    <>
      <div className="d-flex w-100 mb-4 align-items-center">
        <h2 className="mb-0 text-muted">Stories & Narratives</h2>
        <button
          className="icon-btn ms-auto"
          onClick={() => toggleCarousel("prev")}
          disabled={currentSlide === 0}
        >
          <IconChevronLeft size={24} />
        </button>
        <button
          className="icon-btn ms-2 ms-md-3"
          onClick={() => toggleCarousel("next")}
          disabled={currentSlide === stories.length - 1}
        >
          <IconChevronRight size={24} />
        </button>
        <Link
          href="/stories"
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="left"
          title="View All Stories"
          className="icon-btn ms-2 ms-md-3"
        >
          <IconExternalLink size={18} />
        </Link>
      </div>

      <div
        ref={coverCarouselRef}
        className={`carousel slide ${styles.imgcarr}`}
        style={{ height: `${isDesktop ? "320" : "240"}px` }}
        data-bs-touch="false"
      >
        <div className={`carousel-inner ${styles.imgcarr__inner}`}>
          {stories.map((story, i) => (
            <div
              key={story.slug}
              className={`carousel-item ${i === 0 ? "active" : ""} ${
                styles.imgcarr__item
              }`}
            >
              <Link href={`/stories/${story.slug}`}>
                <Image
                  fill
                  className={styles.cimg}
                  src={story.cover}
                  alt={story.slug}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`carousel slide mt-3 ${styles.concarr}`}
        ref={contentCarouselRef}
        data-bs-touch="false"
      >
        <div className={`carousel-inner ${styles.concarr__inner}`}>
          {stories.map((story, i) => (
            <div
              key={story.slug}
              className={`carousel-item ${i === 0 ? "active" : ""} ${
                styles.concarr__item
              }`}
            >
              <Link
                href={`/stories/${story.slug}`}
                className={`mb-1 ${styles.title}`}
              >
                <span className="h3 mb-0">{story.title}</span>
                {story.wip && (
                  <Tag>
                    <IconPoint size={12} />{" "}
                    <span className="ms-1">Ongoing</span>
                  </Tag>
                )}
              </Link>
              <p className="text-light mb-2">{story.excerpt}</p>
              <Suspense fallback="...">
                <TagsList tags={story.tags} />
              </Suspense>
              <p className="text-muted small mt-2">
                {dayjs(story.published).format(DATE_FORMATS.date)}
                <IconPoint size={8} style={{ margin: "0px 4px" }} />
                {story.author}
                <IconPoint size={8} style={{ margin: "0px 4px" }} />
                {story.chapterSlugs.length} Chapters
                {story.wip && story.chapterSlugs.length > 1 && (
                  <>
                    <IconPoint size={8} style={{ margin: "0px 4px" }} />
                    <span className="text-success">
                      Updated:{" "}
                      {dayjs(story.lastUpdated).format(DATE_FORMATS.date)}
                    </span>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
