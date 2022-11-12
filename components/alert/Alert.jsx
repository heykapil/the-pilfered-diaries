import React from "react";
import styles from "./Alert.module.scss";

export default function Alert({ variant, children }) {
  return (
    <div
      className={`alert ${styles["tpd-alert"]} ${styles[`alert-${variant}`]}`}>
      {children}
    </div>
  );
}
