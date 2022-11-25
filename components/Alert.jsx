import React from "react";
import styles from "../styles/modules/Alert.module.scss";

export default function Alert({ variant, children }) {
  console.log(styles);
  return (
    <div className={`alert ${styles.alert} ${styles[variant]}`}>{children}</div>
  );
}
