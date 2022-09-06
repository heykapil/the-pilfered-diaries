import firestore from "../firebase/config";

/**
 * Retrieve a list of stories with count. Always returns a mix of owned and guest stories.
 * @param {Number} limit number of items to get
 */
export function storiesList(limit) {
  return firestore
    .collection("stories")
    .where("draft", "==", false)
    .orderBy("published", "desc")
    .limit(limit)
    .get();
}

/**
 * Retrieve a list of posts by origin type and limit
 * @param {'guest' | 'owned' | 'all'} type type of posts to fetch.
 * @param {Number} limit number of items to get.
 */
export function postsList(type, limit) {
  if (type === "all")
    return firestore
      .collection("posts")
      .where("draft", "==", false)
      .orderBy("published", "desc")
      .limit(limit)
      .get();
  else
    return firestore
      .collection("posts")
      .where("draft", "==", false)
      .where("byGuest", "==", type === "guest")
      .orderBy("published", "desc")
      .limit(limit)
      .get();
}
