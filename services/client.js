import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestoreClient } from "@fb/client";

/**
 * Retrieve a list of approved comments for a specific content
 * @param {'stories' | 'posts'} type The content type [stories/posts]
 * @param {String} target the parent document.
 */
export async function commentsList(type, target) {
  const q = query(
    collection(firestoreClient, "comments"),
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
