import * as yup from "yup";

export const storyFormValues = {
  author: "Amittras",
  byGuest: false,
  draft: true,
  content: null,
  cover: null,
  excerpt: "",
  tags: [],
  title: "",
  published: null,
  lastUpdated: "",
  wip: true,
  storyId: "",
  chapterSlugs: [],
};

export const chapterFormValues = {
  author: "",
  excerpt: "",
  chapterId: "",
  order: 1,
  previousChapter: "",
  nextChapter: "",
  title: "",
  file: null,
  markCompleted: false,
  refreshPassword: "",
};

export const postFormValues = {
  author: "Amittras",
  byGuest: false,
  content: null,
  cover: null,
  draft: false,
  excerpt: "",
  published: null,
  tags: [],
  thumbnail: null,
  title: "",
  postId: "",
  refreshPassword: "",
};

export const submissionFormValues = {
  userName: "",
  emailId: "",
  ideaTitle: "",
  ideaDescription: "",
};

export const subscriptionFormValues = {
  email: "",
};

export const commentFormValues = {
  userName: "",
  email: "",
  title: "",
  body: "",
};

export const loginFormValues = { email: "", password: "" };

export const messageFormValues = {
  name: "",
  email: "",
  message: "",
};

export const storyValidator = yup.object().shape({
  excerpt: yup.string().required("Excerpt is required"),
  title: yup
    .string()
    .required("Title is required")
    .matches(
      /^[A-Za-z0-9\s]*$/,
      "Title must have only alphanumeric characters and spaces."
    ),
  author: yup
    .string()
    .required("Author Name is required")
    .test({
      name: "author",
      message: "You can't be the author if marked as guest.",
      test: (val, ctx) => {
        if (ctx.parent.byGuest && val === "Amittras") return false;
        else return true;
      },
    }),
  tags: yup.array().min(1, "Tags are required").max(5, "Upto 5 tags allowed."),
  content: yup
    .mixed()
    .required("Content file is required")
    .test({
      name: "fileType",
      message: "Invalid File Type",
      test: (value) => {
        if (!value) return false;
        if (!value.name?.endsWith(".mdx")) return false;
        return true;
      },
    }),
  cover: yup
    .mixed()
    .required("Cover Image is missing.")
    .test({
      name: "fileType",
      message: "Invalid File Type",
      test: (value) => {
        if (!value) return false;
        if (!value.name?.endsWith(".avif")) return false;
        return true;
      },
    }),
});

export const chapterValidator = yup.object().shape({
  title: yup.string().required("Title is required"),
  excerpt: yup.string().required("Excerpt is required"),
  refreshPassword: yup.string().required("Refresh Password is required."),
  chapterId: yup
    .string()
    .required("Chapter ID is required")
    .matches(/^\S*$/, { message: "Chapter ID must not have spaces." }),
  previousChapter: yup.string().test({
    name: "previousChapter",
    message: "Previous Chapter is required when it's not the first chapter.",
    test: (value, ctx) => {
      if (ctx.parent.order > 1 && !value) return false;
      return true;
    },
  }),
  order: yup.number().required(),
  file: yup
    .mixed()
    .required("Content file is required")
    .test({
      name: "fileType",
      message: "Invalid File Type",
      test: (value) => {
        if (!value) return false;
        if (!value.name?.endsWith(".mdx")) return false;
        return true;
      },
    }),
});

export const postValidator = yup.object().shape({
  excerpt: yup.string().required("Excerpt is required"),
  title: yup
    .string()
    .required("Title is required")
    .matches(
      /^[A-Za-z0-9\s]*$/,
      "Title must have only alphanumeric characters and spaces."
    ),
  author: yup
    .string()
    .required("Author Name is required")
    .test({
      name: "author",
      message: "You can't be the author if marked as guest.",
      test: (val, ctx) => {
        if (ctx.parent.byGuest && val === "Amittras") return false;
        else return true;
      },
    }),
  tags: yup.array().min(1, "Tags are required").max(5, "Upto 5 tags allowed."),
  refreshPassword: yup.string().when("draft", {
    is: false,
    then: (schema) => schema.required("Refresh Password is required."),
    otherwise: (schema) => schema.optional(),
  }),
  content: yup
    .mixed()
    .required("Content file is required.")
    .test({
      name: "fileType",
      message: "Invalid File Type",
      test: (value) => {
        if (!value) return false;
        if (!value.name?.endsWith(".mdx")) return false;
        return true;
      },
    }),
  cover: yup
    .mixed()
    .required("Cover Image is required.")
    .test({
      name: "fileType",
      message: "Invalid File Type",
      test: (value) => {
        if (!value) return false;
        if (!value.name?.endsWith(".avif")) return false;
        return true;
      },
    }),
  thumbnail: yup
    .mixed()
    .required("Thumbnail is missing.")
    .test({
      name: "fileType",
      message: "Invalid File Type",
      test: (value) => {
        if (!value) return false;
        if (!value.name?.endsWith(".avif")) return false;
        return true;
      },
    })
    .test({
      name: "sameFile",
      message: "Thumbanail and Cover cannot be same",
      test: (val, ctx) => {
        if (val?.name === ctx.parent.cover?.name) return false;
        return true;
      },
    }),
});

export const submissionValidator = yup.object().shape({
  userName: yup.string().required("Name is required."),
  emailId: yup
    .string()
    .email("Invalid Email")
    .required("Email Id is required."),
  ideaTitle: yup
    .string()
    .required("Title is required")
    .max(180, "Title should be 180 characters or less."),
  ideaDescription: yup
    .string()
    .required("Brief description is required.")
    .min(120, "Title should be between 120-1000 characters in length")
    .max(1000, "Title should be between 120-1000 characters in length"),
});

export const subscriptionValidator = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email ID.")
    .required("Please enter an Email ID."),
});

export const commentValidator = yup.object().shape({
  userName: yup.string().required("Name is required."),
  email: yup.string().optional().email("Invalid Email"),
  title: yup.string().required("Comment title is required"),
  body: yup.string().optional(),
});

export const loginValidator = yup.object().shape({
  email: yup.string().email("Invalid Email.").required("Email is required."),
  password: yup.string().required("Password is required."),
});

export const messageValidator = yup.object().shape({
  name: yup.string().required("Name is required."),
  email: yup.string().email("Invalid Email").required("Email Id is required."),
  message: yup
    .string()
    .required("Message is required")
    .min(20, "Message should be between 20-1024 characters in length")
    .max(1024, "Message should be between 20-1024 characters in length"),
});
