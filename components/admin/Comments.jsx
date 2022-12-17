import { DATE_FORMATS } from "@constants/app";
import { store } from "@fb/client";
import { IconCheck, IconPoint, IconTrash } from "@tabler/icons";
import dayjs from "dayjs";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/Admin.module.scss";

export default function Comments() {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const q = query(
      collection(store, "comments"),
      where("approved", "==", false),
      orderBy("date", "desc")
    );
    return onSnapshot(q, (s) => {
      setComments(
        s.docs.map((doc) => ({
          ...doc.data(),
          date: doc.data().date.toDate().toISOString(),
          id: doc.id,
        }))
      );
    });
  }, []);

  const approveComment = async (cId) => {
    const cRef = doc(store, "comments", cId);
    await updateDoc(cRef, { approved: true });
  };

  const deleteComment = async (cId) => {
    const cRef = doc(store, "comments", cId);
    await deleteDoc(cRef);
  };

  if (!comments.length)
    return (
      <div className="d-flex h-100 w-100 align-items-center">
        <h2 className="text-success text-center w-100">
          No new comments need approval!!
        </h2>
      </div>
    );

  return (
    <div className="d-flex flex-column gap-3 p-3">
      {comments.map((c) => (
        <div className={`shadow ${styles.comment}`} key={c.id}>
          <div className="d-flex mb-2 justify-content-between">
            <h5 className="mb-0">{c.title}</h5>
            <div className="text-end">
              <p className="mb-1 text-primary">{c.userName}</p>
              <p className="small mb-0 text-muted">
                {c.email || "---No Email---"}
              </p>
            </div>
          </div>
          <p className="mb-2">{c.body || "---No Body---"}</p>
          <hr className="my-2" />
          <div className="d-flex">
            <p className="small text-muted mb-0 me-auto">
              <span>{dayjs(c.date).format(DATE_FORMATS.date)}</span>
              <span className="mx-1 text-light">
                <IconPoint size={10} />
              </span>
              <span>{c.type === "stories" ? "Story ID: " : "Post ID: "}</span>
              <Link
                href={`/${c.type}/${c.target}`}
                target="_blank"
                className="ms-1"
              >
                {c.target}
              </Link>
            </p>
            <button
              className={`me-1 ${styles.comment__approve}`}
              onClick={() => approveComment(c.id)}
            >
              <IconCheck size={16} />
            </button>
            <button
              className={styles.comment__approve}
              onClick={() => deleteComment(c.id)}
            >
              <IconTrash size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
