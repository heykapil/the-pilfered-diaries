import React from "react";
import styles from "../styles/NotFound.module.scss";
import notFound from "../resources/images/NotFound.svg";
import Image from "next/image";
import { useMediaQuery } from "../hooks/media-query";
import Link from "next/link";

export default function NotFound() {
  const isLargeScreen = useMediaQuery("md");
  return (
    <div className={styles.wrapper}>
      <Image
        src={notFound}
        width={isLargeScreen ? 512 : 330}
        blurDataURL={notFound.blurDataURL}
        alt="submit-work-artwork"
        className="mb-3"
      />
      <h4 className="text-center pb-3 border-bottom border-primary">
        The page you are looking for was not found!
      </h4>
      <p className="text-center text-muted">Here are some things you can do!</p>
      <div className="d-flex gap-2 flex-wrap justify-content-center">
        <Link href="/" className={styles.link}>
          Go Back Home
        </Link>
        <Link href="/posts" className={styles.link}>
          Explore Posts
        </Link>
        <Link href="/stories" className={styles.link}>
          Explore Stories
        </Link>
        <Link href="/submissions" className={styles.link}>
          Feature your own content
        </Link>
      </div>
    </div>
  );
}
