import { storage, store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { storyFormValues, storyValidator } from "@lib/validators";
import { IconX } from "@tabler/icons";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/modules/Admin.module.scss";

export default function AddStory({ onCompleted }) {
  const contentInput = useRef();
  const coverInput = useRef();

  const [processing, setProcessing] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [urls, setUrls] = useState({
    cover: "",
    content: "",
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
    defaultValues: storyFormValues,
    resolver: yupResolver(storyValidator),
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
    if (urls.content && urls.cover) {
      setProcessing("Creating Story...");
      (async () => {
        try {
          const story = {
            ...getValues(),
            ...urls,
            lastUpdated: Timestamp.fromDate(new Date()),
          };
          delete story.storyId;
          const docRef = doc(store, "stories", getValues("storyId"));
          await setDoc(docRef, story);
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

  const createStory = async (values) => {
    setProcessing("Uploading Files...");
    const coverRef = ref(
      storage,
      `stories/${values.storyId}/${values.cover.name}`
    );
    const contentRef = ref(
      storage,
      `stories/${values.storyId}/${values.content.name}`
    );

    const coverUpload = uploadBytesResumable(coverRef, values.cover);
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
  };

  return (
    <div className="p-3">
      <p className="h4">Create a new story</p>
      <form className="row" onSubmit={handleSubmit(createStory)}>
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <input
              type="text"
              {...register("title")}
              className={`form-control form-control-sm ${
                errors.title ? "is-invalid" : ""
              }`}
              placeholder="Story Title *"
              autoFocus
              onChange={(e) => {
                register("title").onChange(e);
                setValue(
                  "storyId",
                  e.target.value.trim().replace(/\s/g, "-").toLowerCase()
                );
              }}
              readOnly={processing}
            />
            <label>Story Title *</label>
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
              {...register("storyId")}
              className={`form-control form-control-sm ${
                errors.storyId ? "is-invalid" : ""
              }`}
              placeholder="Slug"
              readOnly
            />
            <label>Slug</label>
            {errors.storyId && (
              <div className="invalid-feedback">{errors.storyId.message}</div>
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
              <span className="ms-2">Story is by Guest</span>
            </label>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <textarea
              className={`form-control ${errors.excerpt ? "is-invalid" : ""}`}
              {...register("excerpt")}
              placeholder="Story excerpt"
              style={{ height: "165px", resize: "none" }}
              readOnly={processing}
            ></textarea>
            <label>Story excerpt</label>
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
                placeholder="Story Tags"
                value={tagInput}
                readOnly={processing}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <label>Story Tags</label>
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
        <div className="col-md-6 mb-3">
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
                "Add file for Preface"
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
        <div className="col-md-6">
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
        <div className="col-md-12 d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-sm btn-success"
            disabled={processing}
          >
            {processing || "Create Story"}
          </button>
        </div>
      </form>
    </div>
  );
}
