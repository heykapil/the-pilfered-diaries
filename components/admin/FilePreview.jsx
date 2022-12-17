import React, { useRef, useState } from "react";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import readingTime from "reading-time";
import { AVG_READING_SPEED } from "@constants/app";
import styles from "../../styles/modules/Admin.module.scss";
import Markdown from "@components/Markdown";

export default function FilePreview() {
  const [fileData, setFileData] = useState(null);
  const ref = useRef();

  const handleFile = (e) => {
    const allowedExtensions = [".md", ".mdx"];
    const file = e.target.files[0];
    if (file) {
      const fileType = file.name.slice(file.name.lastIndexOf("."));
      if (!allowedExtensions.includes(fileType)) {
        return;
      } else {
        const reader = new FileReader();
        reader.onloadend = async (e) => {
          const { content: fileContent, data } = grayMatter(e.target.result);
          const content = await serialize(fileContent);
          setFileData({
            content,
            data,
            file,
            readTime: readingTime(fileContent, {
              wordsPerMinute: AVG_READING_SPEED,
            }),
          });
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className={styles.preview}>
      <input
        type="file"
        className={styles.preview__input}
        multiple={false}
        onChange={handleFile}
        ref={ref}
      />
      <div
        className={`d-flex justify-content-between bg-dark shadow ${styles.preview__header}`}
      >
        <button
          onClick={() => ref.current.click()}
          className="btn btn-sm btn-outline-light"
        >
          {fileData ? "Change File" : "Click to Open File"}
        </button>
        {fileData && (
          <>
            <p className="text-center mb-0">
              {fileData.readTime.text} ({fileData.readTime.words} words)
            </p>
            <button
              onClick={() => {
                setFileData(null);
                ref.current.value = null;
              }}
              className="btn btn-sm btn-danger"
            >
              Close File
            </button>
          </>
        )}
      </div>
      {fileData && <Markdown {...fileData.content} />}
    </div>
  );
}
