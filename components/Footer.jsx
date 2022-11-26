import {
  APP_TITLE,
  FOOTER_LINK_PROPS,
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
    <div className={styles.footer}>
      <p className="small m-0">
        <span className="me-2">
          <IconCopyright size={18} />
        </span>
        {APP_TITLE} {dayjs().format("YYYY")}
      </p>
      <div className="d-flex gap-1">
        <Link
          {...FOOTER_LINK_PROPS}
          href={INSTA_LINK}
          title={`Follow ${APP_TITLE} on Instagram`}
          className={`${styles.lnk} ${styles.lnk__insta}`}
        >
          <IconBrandInstagram size={20} />
        </Link>
        <Link
          {...FOOTER_LINK_PROPS}
          href={LINKEDIN_LINK}
          title="Amittras Pal on LinkedIn"
          className={`${styles.lnk} ${styles.lnk__lkdn}`}
        >
          <IconBrandLinkedin size={20} />
        </Link>
        <Link
          {...FOOTER_LINK_PROPS}
          href={REPO_LINK}
          title="View Source on Github"
          className={`${styles.lnk} ${styles.lnk__git}`}
        >
          <IconBrandGithub size={20} />
        </Link>

        <Link
          {...FOOTER_LINK_PROPS}
          href="https://getbootstrap.com/"
          title="UI Built on Bootstrap 5.0"
          className={`${styles.lnk} ${styles.lnk__bs5}`}
        >
          <IconBrandBootstrap size={20} />
        </Link>
        <Link
          {...FOOTER_LINK_PROPS}
          href="https://nextjs.org/"
          title="Built with NextJS"
          className={`${styles.lnk} ${styles.lnk__next}`}
        >
          <IconBrandNextjs size={20} />
        </Link>
        <Link
          {...FOOTER_LINK_PROPS}
          href="https://firebase.google.com/"
          title="Data secured on Firebase"
          className={`${styles.lnk} ${styles.lnk__firebase}`}
        >
          <IconBrandFirebase size={20} />
        </Link>
      </div>
    </div>
  );
}
