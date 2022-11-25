import { IconBrandInstagram } from "@tabler/icons";
import React from "react";
import {
  APP_TITLE,
  INSTA_HANDLE,
  INSTA_LINK,
  TAGLINE,
} from "../../constants/app.constants";
import styles from "../../styles/Home.module.scss";

export default function Header({ siteCover }) {
  return (
    <div
      className={`container-fluid ${styles["tpd-home__header"]}`}
      style={{ backgroundImage: `url(${siteCover.url})` }}
    >
      <div className="container px-0 text-center">
        <h2 className={`display-1 mb-0 ${styles.tagline}`}>{TAGLINE}</h2>
        <p className="h1 text-primary mb-0 mt-3">{APP_TITLE}</p>
        <div className="d-flex mt-4 gap-2 justify-content-center">
          <a
            href={INSTA_LINK}
            className="text-white"
            target="_blank"
            rel="noreferrer"
          >
            <IconBrandInstagram size={18} />
            <span>{INSTA_HANDLE}</span>
          </a>
        </div>
      </div>
      <p className={`${styles["photo-credit"]} small text-light`}>
        Photo By: {siteCover.photoCredit}
      </p>
    </div>
  );
}
