import { store } from "@fb/client";
import axios from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

/**
 * Retrieve a list of approved comments for a specific content
 * @param {'stories' | 'posts'} type The content type [stories/posts]
 * @param {String} target the parent document.
 */
export async function commentsList(type, target) {
  const q = query(
    collection(store, "comments"),
    where("type", "==", type),
    where("target", "==", target),
    where("approved", "==", true),
    orderBy("date", "desc")
  );
  const response = await getDocs(q);
  return response.docs.map((doc) => ({
    ...doc.data(),
    date: doc.data().date.toDate().toISOString(),
    id: doc.id,
  }));
}

/**
 * Calls the own revalidation API to refresh a given list of pages.
 * @param {String} refreshPassword password to refresh pages.
 * @param {Array.<String>} pagePaths List of paths to refresh
 * @returns {import("axios").AxiosResponse}
 */
export function refreshPages(refreshPassword, pagePaths) {
  return axios.post("/api/revalidate", {
    pwd: refreshPassword,
    paths: pagePaths,
  });
}
