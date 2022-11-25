import {
  APP_TITLE,
  INSTA_LINK,
  LINKEDIN_LINK,
  REPO_LINK,
} from "@constants/app";
import {
  IconBrandBootstrap,
  IconBrandFirebase,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandNextjs,
  IconCopyright,
} from "@tabler/icons";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import styles from "../styles/modules/Footer.module.scss";

export default function Footer() {
  return (
    <div className={styles["tpd-footer"]}>
      <p className="small m-0">
        <span className="me-2">
          <IconCopyright size={18} />
        </span>
        {APP_TITLE} {dayjs().format("YYYY")}
      </p>
      <div className="d-flex gap-1">
        <Link
          href={INSTA_LINK}
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="top"
          title={`Follow ${APP_TITLE} on Instagram`}
          className={`${styles["footer-link"]} ${styles["footer-link__instagram"]}`}
          target="_blank"
        >
          <IconBrandInstagram size={20} />
        </Link>
        <Link
          href={LINKEDIN_LINK}
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="top"
          title="Amittras Pal on LinkedIn"
          className={`${styles["footer-link"]} ${styles["footer-link__linkedin"]}`}
          target="_blank"
        >
          <IconBrandLinkedin size={20} />
        </Link>
        <Link
          href={REPO_LINK}
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="top"
          title="View Source on Github"
          className={`${styles["footer-link"]} ${styles["footer-link__github"]}`}
          target="_blank"
        >
          <IconBrandGithub size={20} />
        </Link>

        <Link
          href="https://getbootstrap.com/"
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="top"
          title="UI Built on Bootstrap 5.0"
          className={`${styles["footer-link"]} ${styles["footer-link__bootstrap"]}`}
          target="_blank"
        >
          <IconBrandBootstrap size={20} />
        </Link>
        <Link
          href="https://nextjs.org/"
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="top"
          title="Built with NextJS"
          className={`${styles["footer-link"]} ${styles["footer-link__nextjs"]}`}
          target="_blank"
        >
          <IconBrandNextjs size={20} />
        </Link>
        <Link
          href="https://firebase.google.com/"
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="top"
          title="Data secured on Firebase"
          className={`${styles["footer-link"]} ${styles["footer-link__firebase"]}`}
          target="_blank"
        >
          <IconBrandFirebase size={20} />
        </Link>
      </div>
    </div>
  );
}
