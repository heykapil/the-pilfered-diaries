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

/**
 * Retrieve a list of approved comments for a specific content
 * @param {'stories' | 'posts'} type The content type [stories/posts]
 * @param {String} target the parent document.
 */
export function commentsList(type, target) {
  return firestore
    .collection("comments")
    .where("type", "==", type)
    .where("target", "==", target)
    .where("approved", "==", true)
    .orderBy("date", "desc")
    .get();
}

/**
 * Retrieve a list related posts for a given post-slug & tags list
 * @param {String} slug The content type [stories/posts]
 * @param {Array.<String>} tags the parent document.
 */
export function getRelatedPosts(slug, tags) {
  return firestore
    .collection("posts")
    .where("__name__", "!=", slug)
    .where("tags", "array-contains-any", tags)
    .limit(4)
    .get();
}

/**
 * Retrieve a list related stories for a given slug & tags list
 * @param {String} slug The content type [stories/posts]
 * @param {Array.<String>} tags the parent document.
 */
export function getRelatedStories(slug, tags) {
  return firestore
    .collection("stories")
    .where("__name__", "!=", slug)
    .where("tags", "array-contains-any", tags)
    .limit(4)
    .get();
}
