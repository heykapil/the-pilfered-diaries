import TagsList from "@components/TagsList";
import { DATE_FORMATS } from "@constants/app";
import {
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconPoint,
} from "@tabler/icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import styles from "../../styles/modules/Home.module.scss";

export default function StoriesCarousel({ stories }) {
  const coverCarouselRef = useRef();
  const contentCarouselRef = useRef();
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
      setTimeout(() => contentCarousel.next(), 100);
    } else {
      setCurrentSlide((prev) => prev - 1);
      coverCarousel.prev();
      setTimeout(() => contentCarousel.prev(), 100);
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
        className={`carousel slide ${styles["cover-carousel"]}`}
        data-bs-touch="false"
      >
        <div className={`carousel-inner ${styles["cover-carousel__inner"]}`}>
          {stories.map((story, index) => (
            <div
              key={story.slug}
              className={`carousel-item ${index === 0 ? "active" : ""} ${
                styles["cover-carousel__item"]
              }`}
            >
              <Link href={`/stories/${story.slug}`}>
                <Image
                  style={{
                    objectFit: "cover",
                    objectPosition: "50% 50%",
                    borderRadius: "0.75rem",
                  }}
                  fill
                  className={styles["story-cover-img"]}
                  src={story.cover}
                  alt={story.slug}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`carousel slide mt-3 ${styles["content-carousel"]}`}
        ref={contentCarouselRef}
        data-bs-touch="false"
      >
        <div className={`carousel-inner ${styles["content-carousel__inner"]}`}>
          {stories.map((story, index) => (
            <div
              key={story.slug}
              className={`carousel-item ${index === 0 ? "active" : ""} ${
                styles["content-carousel__item"]
              }`}
            >
              <Link
                href={`/stories/${story.slug}`}
                className={`h3 mb-1 ${styles["story-title"]}`}
              >
                {story.title}
              </Link>
              <p className="text-light mb-2">{story.excerpt}</p>
              <TagsList tags={story.tags} showCount={4} />
              <p className="text-muted small mt-2">
                {dayjs(story.published).format(DATE_FORMATS.date)}
                <IconPoint size={8} style={{ margin: "0px 4px" }} />
                {story.author}
                <IconPoint size={8} style={{ margin: "0px 4px" }} />
                {story.chapterCount} Chapters
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
