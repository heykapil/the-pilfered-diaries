const POST_ROUTES = ["/posts", "/posts/[slug]"];
const STORY_ROUTES = [
  "/stories",
  "/stories/[slug]",
  "/stories/[slug]/[chapter]",
];

export const ROUTES = [
  {
    path: "/",
    matchers: ["/"],
    label: "Home",
  },
  {
    path: "/about",
    matchers: ["/about"],
    label: "About",
  },
  {
    path: "/posts",
    matchers: POST_ROUTES,
    label: "Posts",
  },
  {
    path: "/stories",
    matchers: STORY_ROUTES,
    label: "Stories & Narratives",
  },
  {
    path: "/submissions",
    matchers: ["/submissions"],
    label: "Submit an Idea",
  },
];

export const QUICK_COLLAPSE_NAV_ROUTES = [
  "/stories/[slug]/[chapter]",
  "/submissions",
  "/file-preview",
  "/about",
];
