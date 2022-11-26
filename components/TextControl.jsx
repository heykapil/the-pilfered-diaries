import { FONT_SIZE_RANGE } from "@constants/app";
import {
  IconTextDecrease,
  IconTextIncrease,
  IconTextSize,
  IconX,
} from "@tabler/icons";
import React, { useEffect, useState } from "react";
import styles from "../styles/modules/TextControl.module.scss";

export default function TextControl({
  onSizeChange,
  initialSize,
  //   TODO: Reader theme change
  //   onThemeChange,
}) {
  const [show, setShow] = useState(false);
  const [fontSize, setFontSize] = useState(initialSize);
  const [min, max] = FONT_SIZE_RANGE;

  const increaseSize = () => {
    if (fontSize < max) {
      setFontSize((prev) => prev + 0.5);
      localStorage.setItem("fontSize", fontSize + 0.5);
    }
  };
  const decreaseSize = () => {
    if (fontSize > min) {
      setFontSize((prev) => prev - 0.5);
      localStorage.setItem("fontSize", fontSize - 0.5);
    }
  };

  useEffect(() => {
    const storedSize = Number(localStorage.getItem("fontSize"));
    setFontSize(storedSize > 0 ? storedSize : initialSize);
  }, [initialSize]);

  useEffect(() => {
    onSizeChange(fontSize);
  }, [fontSize, onSizeChange]);

  return (
    <>
      <div className={`${styles.control} ${show ? styles.control__show : ""}`}>
        <button
          className={styles.control__size}
          onClick={decreaseSize}
          disabled={fontSize === min}
        >
          <IconTextDecrease size={18} />
        </button>
        <input
          type="text"
          readOnly
          value={fontSize}
          className={styles.control__value}
        />
        <button
          className={styles.control__size}
          onClick={increaseSize}
          disabled={fontSize === max}
        >
          <IconTextIncrease size={18} />
        </button>
      </div>
      <button className={styles.button} onClick={() => setShow(!show)}>
        {show ? <IconX size={24} /> : <IconTextSize size={24} />}
      </button>
    </>
  );
}
