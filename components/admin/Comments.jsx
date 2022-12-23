import { DATE_FORMATS } from "@constants/app";
import { store } from "@fb/client";
import { refreshPages } from "@services/client";
import { IconCheck, IconLoader3, IconPoint, IconTrash } from "@tabler/icons";
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
import { useForm } from "react-hook-form";
import styles from "../../styles/modules/Admin.module.scss";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [processing, setProcessing] = useState("");
  const [selectedComments, setSelectedComments] = useState([]);
  const [workingSet, setWorkingSet] = useState("");

  const handleSelection = (e) => {
    if (e.target.checked) {
      setSelectedComments((prev) => [...prev, e.target.value]);
      if (!workingSet) {
        const commentInfo = comments.find((i) => i.id === e.target.value);
        setWorkingSet(`${commentInfo.type}/${commentInfo.target}`);
      }
    } else {
      const remainingComments = selectedComments.filter(
        (c) => c !== e.target.value
      );
      setSelectedComments(remainingComments);
      if (remainingComments.length === 0) setWorkingSet("");
    }
  };

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

  const {
    register,
    getValues,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      refreshPassword: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        refreshPassword: yup.string().required(),
      })
    ),
  });

  const approveComments = async () => {
    try {
      setProcessing("Approving...");
      if (!getValues("refreshPassword")) {
        setError(
          "refreshPassword",
          { type: "required", message: "Required" },
          { shouldFocus: true }
        );
        return;
      }
      await Promise.all(
        selectedComments.map((comment) => {
          return updateDoc(doc(store, "comments", comment), { approved: true });
        })
      );
      setProcessing("Refreshing Pages...");
      await refreshPages(getValues("refreshPassword"), [workingSet]);
      setSelectedComments([]);
      setWorkingSet("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComments = async () => {
    try {
      setProcessing("Deleting...");
      await Promise.all(
        selectedComments.map((comment) => {
          return deleteDoc(doc(store, "comments", comment));
        })
      );
      setSelectedComments([]);
      setWorkingSet("");
    } catch (error) {
      console.log(error);
    }
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
    <div className={styles.comments}>
      <div
        className={`bg-dark shadow d-flex align-items-center ${styles.comments__header}`}
      >
        <button
          className="btn btn-sm btn-outline-success me-2"
          disabled={selectedComments.length === 0 || !isValid || processing}
          onClick={approveComments}
        >
          {processing || "Approve"}
        </button>
        <button
          className="btn btn-sm btn-outline-danger me-2"
          disabled={selectedComments.length === 0 || processing}
          onClick={deleteComments}
        >
          {processing || "Delete"}
        </button>
        <button
          className="btn btn-sm btn-outline-primary"
          disabled={selectedComments.length === 0 || processing}
          onClick={() => {
            setSelectedComments([]);
            setWorkingSet("");
          }}
        >
          Clear
        </button>

        {workingSet && (
          <p className="mx-auto mb-0 small">
            <span className="text-muted">Selected Comments For:</span>{" "}
            {workingSet}
          </p>
        )}
        <input
          type="text"
          {...register("refreshPassword")}
          placeholder="Refresh Passowrd"
          className={`form-control w-25 ${
            errors?.refreshPassword ? "is-invalid" : ""
          } ${workingSet ? "" : "ms-auto"}`}
        />
      </div>
      <div className="d-flex flex-column gap-3 p-3">
        {comments.map((c) => (
          <div className={`shadow ${styles.comment}`} key={c.id}>
            <div className="d-flex mb-2">
              <label className="me-2">
                <input
                  type="checkbox"
                  className="form-check"
                  name=""
                  value={c.id}
                  checked={selectedComments.includes(c.id)}
                  onChange={handleSelection}
                  disabled={
                    workingSet && workingSet !== `${c.type}/${c.target}`
                  }
                />
              </label>
              <h5 className="mb-0">{c.title}</h5>
              <div className="text-end ms-auto">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
