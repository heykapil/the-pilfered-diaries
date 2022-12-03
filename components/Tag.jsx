import React from "react";
import styles from "../styles/modules/Tag.module.scss";

export default function Tag({ children }) {
  return (
    <span className={`badge ${styles.tag} ${styles.tag__success}`}>
      {children}
    </span>
  );
}
