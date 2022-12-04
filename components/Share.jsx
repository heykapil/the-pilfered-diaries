import { SHARE } from "@constants/app";
import { firebaseApp } from "@fb/client";
import { generateShareLink } from "@lib/utils";
import { getAnalytics, logEvent } from "firebase/analytics";
import Link from "next/link";
import React from "react";
import styles from "../styles/modules/Share.module.scss";

function Share({ title, url, contentType }) {
  const logShare = (method) => {
    const analytics = getAnalytics(firebaseApp);
    logEvent(analytics, "share", {
      method,
      content_type: contentType,
      item_id: title,
    });
  };

  return (
    <>
      <span className="h5 mb-0">Share &ldquo;{title}&rdquo;</span>
      <div className={styles.share_list}>
        {Object.entries(SHARE).map(([platform, config]) => (
          <Link
            key={platform}
            target="_blank"
            href={generateShareLink(title, url, platform)}
            rel="noopener noreferrer"
            className={styles.share_btn}
            onClick={() => logShare(config.label)}
          >
            <span className="me-2">{config.label}</span>
            {config.icon}
          </Link>
        ))}
      </div>
    </>
  );
}

export default Share;
