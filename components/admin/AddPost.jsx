import { storage, store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { postFormValues, postValidator } from "@lib/validators";
import { IconX } from "@tabler/icons";
import axios from "axios";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/modules/Admin.module.scss";

export default function AddPost({ onCompleted }) {
  const contentInput = useRef();
  const coverInput = useRef();
  const thumbnailInput = useRef();

  const [processing, setProcessing] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [urls, setUrls] = useState({
    cover: "",
    content: "",
    thumbnail: "",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: postFormValues,
    resolver: yupResolver(postValidator),
  });

  useEffect(() => {
    if (tagInput.endsWith(",")) {
      setValue("tags", [...getValues("tags"), tagInput.split(",")[0]], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setTagInput("");
    }
  }, [getValues, setValue, tagInput]);

  const removeTag = (tag) => {
    const updatedTags = watch("tags").filter((t) => t !== tag);
    setValue("tags", updatedTags, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (urls.content && urls.cover && urls.thumbnail) {
      setProcessing("Creating Post...");
      (async () => {
        const formValues = getValues();
        try {
          const post = {
            ...formValues,
            ...urls,
          };
          if (!formValues.draft)
            post.published = Timestamp.fromDate(new Date());
          delete post.postId;
          delete post.refreshPassword; 
          const docRef = doc(store, "posts", formValues.postId);
          await setDoc(docRef, post);

          if (!formValues.draft) {
            await await axios.post("/api/revalidate", {
              pwd: formValues.refreshPassword,
              paths: ["posts"],
            });
          }
          setProcessing("Completed.");
          setTimeout(() => {
            reset();
            onCompleted();
          }, 500);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [getValues, onCompleted, reset, urls]);

  const createPost = (values) => {
    setProcessing("Uploading Files...");
    const coverRef = ref(
      storage,
      `posts/${values.postId}/${values.cover.name}`
    );
    const thumbRef = ref(
      storage,
      `posts/${values.postId}/${values.thumbnail.name}`
    );
    const contentRef = ref(
      storage,
      `posts/${values.postId}/${values.content.name}`
    );

    const coverUpload = uploadBytesResumable(coverRef, values.cover);
    const thumbUpload = uploadBytesResumable(thumbRef, values.thumbnail);
    const contentUpload = uploadBytesResumable(contentRef, values.content);

    coverUpload.on(
      "state_changed",
      (_snap) => null,
      (err) => {
        console.error(err);
      },
      () =>
        (async () => {
          const coverUrl = await getDownloadURL(coverUpload.snapshot.ref);
          setUrls((prev) => ({ ...prev, cover: coverUrl }));
        })()
    );
    contentUpload.on(
      "state_changed",
      (_snap) => null,
      (err) => {
        console.error(err);
      },
      () =>
        (async () => {
          const contentUrl = await getDownloadURL(contentUpload.snapshot.ref);
          setUrls((prev) => ({ ...prev, content: contentUrl }));
        })()
    );
    thumbUpload.on(
      "state_changed",
      (_snap) => null,
      (err) => {
        console.error(err);
      },
      () =>
        (async () => {
          const contentUrl = await getDownloadURL(thumbUpload.snapshot.ref);
          setUrls((prev) => ({ ...prev, thumbnail: contentUrl }));
        })()
    );
  };

  return (
    <div className="p-3">
      <p className="h4">Create a new post.</p>
      <form className="row" onSubmit={handleSubmit(createPost)}>
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <input
              type="text"
              {...register("title")}
              className={`form-control form-control-sm ${
                errors.title ? "is-invalid" : ""
              }`}
              placeholder="Post Title *"
              autoFocus
              onChange={(e) => {
                register("title").onChange(e);
                setValue(
                  "postId",
                  e.target.value.trim().replace(/\s/g, "-").toLowerCase()
                );
              }}
              readOnly={processing}
            />
            <label>Post Title *</label>
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <input
              type="text"
              {...register("author")}
              className={`form-control form-control-sm ${
                errors.author ? "is-invalid" : ""
              }`}
              placeholder="Author"
              readOnly={!watch("byGuest") || processing}
            />
            <label>Author</label>
            {errors.author && (
              <div className="invalid-feedback">{errors.author.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              {...register("postId")}
              className={`form-control form-control-sm ${
                errors.postId ? "is-invalid" : ""
              }`}
              placeholder="Slug"
              readOnly
            />
            <label>Slug</label>
            {errors.postId && (
              <div className="invalid-feedback">{errors.postId.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="d-flex gap-3">
            <label
              className="d-flex align-items-center my-2"
              style={{ width: "fit-content" }}
            >
              <input
                className="form-check-input"
                type="checkbox"
                {...register("byGuest")}
                onChange={(e) => {
                  register("byGuest").onChange?.(e);
                  setValue("author", e.target.checked ? "" : "Amittras", {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
              />
              <span className="ms-2">Post is by Guest</span>
            </label>
            <label
              className="d-flex align-items-center my-2"
              style={{ width: "fit-content" }}
            >
              <input
                className="form-check-input"
                type="checkbox"
                {...register("draft")}
              />
              <span className="ms-2">Mark as draft</span>
            </label>
          </div>
          {watch("draft") && (
            <ul className="ps-3">
              <li className="small text-danger">
                You will have to manually publish this post.
              </li>
              <li className="small text-danger">
                Publish date will have to be set manually.
              </li>
              <li className="small text-danger">
                Pages on the site will not be refreshed.
              </li>
            </ul>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <textarea
              className={`form-control ${errors.excerpt ? "is-invalid" : ""}`}
              {...register("excerpt")}
              placeholder="Post excerpt"
              style={{ height: "165px", resize: "none" }}
              readOnly={processing}
            ></textarea>
            <label>Post excerpt</label>
            {errors.excerpt && (
              <div className="invalid-feedback">{errors.excerpt.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div
            className={`${styles.tag} ${
              errors.tags ? styles.tag__invalid : ""
            }`}
          >
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Post Tags"
                value={tagInput}
                readOnly={processing}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <label>Post Tags</label>
              <div className={styles.tag__value}>
                {watch("tags").map((tag, i) => (
                  <span
                    className={`badge ${styles.tag__item}`}
                    key={`${tag}-${i}`}
                  >
                    {tag}
                    <button
                      className={styles.tag__remove}
                      onClick={() => removeTag(tag)}
                    >
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {errors.tags && (
            <p className="text-danger small mb-0 mt-1">{errors.tags.message}</p>
          )}
        </div>

        <div className="col-md-4 mb-3">
          <div
            className={`${styles.file} ${
              errors.content?.message ? styles.file__invalid : ""
            }`}
            onClick={() => {
              if (!processing) contentInput.current.click();
            }}
          >
            <p className="mb-1">
              {watch("content")?.name ? (
                <span className="text-success">{watch("content")?.name}</span>
              ) : (
                "Add Content File"
              )}
            </p>
            <p className="small mb-0 text-muted">Only .MDX files supported.</p>
            <input
              type="file"
              {...register("content")}
              onChange={(e) => {
                setValue("content", e.target.files[0], {
                  shouldValidate: true,
                  shouldTouch: true,
                  shouldDirty: true,
                });
              }}
              ref={contentInput}
            />
            {watch("content")?.name && (
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("content", null, {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                }}
              >
                Remove
              </button>
            )}
            {errors.content && (
              <p className="small text-danger mb-0">{errors.content.message}</p>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div
            className={`${styles.file} ${
              errors.cover?.message ? styles.file__invalid : ""
            }`}
            onClick={() => {
              if (!processing) coverInput.current.click();
            }}
          >
            <p className="mb-1">
              {watch("cover")?.name ? (
                <span className="text-success">{watch("cover")?.name}</span>
              ) : (
                "Add file for Cover"
              )}
            </p>
            <p className="small mb-0 text-muted">Only .AVIF files supported.</p>
            <input
              type="file"
              {...register("cover")}
              onChange={(e) => {
                setValue("cover", e.target.files[0], {
                  shouldValidate: true,
                  shouldTouch: true,
                  shouldDirty: true,
                });
              }}
              ref={coverInput}
            />
            {watch("cover")?.name && (
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("cover", null, {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                }}
              >
                Remove
              </button>
            )}
            {errors.cover && (
              <p className="small text-danger mb-0">{errors.cover.message}</p>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div
            className={`${styles.file} ${
              errors.thumbnail?.message ? styles.file__invalid : ""
            }`}
            onClick={() => {
              if (!processing) thumbnailInput.current.click();
            }}
          >
            <p className="mb-1">
              {watch("thumbnail")?.name ? (
                <span className="text-success">{watch("thumbnail")?.name}</span>
              ) : (
                "Add file for Thumbnail"
              )}
            </p>
            <p className="small mb-0 text-muted">Only .AVIF files supported.</p>
            <input
              type="file"
              {...register("thumbnail")}
              onChange={(e) => {
                setValue("thumbnail", e.target.files[0], {
                  shouldValidate: true,
                  shouldTouch: true,
                  shouldDirty: true,
                });
              }}
              ref={thumbnailInput}
            />
            {watch("thumbnail")?.name && (
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("thumbnail", null, {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                }}
              >
                Remove
              </button>
            )}
            {errors.thumbnail && (
              <p className="small text-danger mb-0">
                {errors.thumbnail.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-md-12 d-flex justify-content-between">
          {!watch("draft") && (
            <div className="form-floating w-50">
              <input
                type="password"
                {...register("refreshPassword")}
                className={`form-control form-control-sm ${
                  errors.refreshPassword ? "is-invalid" : ""
                }`}
                placeholder="Refresh Password"
              />
              <label>Refresh Password</label>
              {errors.refreshPassword && (
                <div className="invalid-feedback">
                  {errors.refreshPassword.message}
                </div>
              )}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-sm btn-success my-auto ms-auto"
            disabled={processing}
          >
            {processing || "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
