import { store } from "@fb/client";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    const q = query(collection(store, "submissions"));
    return onSnapshot(q, (s) => {
      setSubmissions(
        s.docs.map((doc) => ({
          ...doc.data(),
          date: doc.data().date.toDate().toISOString(),
          id: doc.id,
        }))
      );
    });
  }, []);

  if (!submissions.length)
    return (
      <div className="d-flex h-100 w-100 align-items-center p-3">
        <h2 className="text-success text-center w-100">No new submissions!!</h2>
      </div>
    );

  return <div className="d-flex flex-column gap-3 p-3"></div>;
}
