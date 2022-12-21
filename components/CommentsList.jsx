import { COMMENT_HEADER, COMMENT_NOTICE, DATE_FORMATS } from "@constants/app";
import { useSubscription } from "@context/Subscription";
import { store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotifications } from "@hooks/notifications";
import noComments from "@images/NoComments.svg";
import { commentFormValues, commentValidator } from "@lib/validators";
import { commentsList } from "@services/client";
import { IconCheck, IconMessagePlus, IconSend, IconX } from "@tabler/icons";
import dayjs from "dayjs";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/modules/CommentsList.module.scss";

export default function CommentsList({
  title,
  type,
  target,
  comments = [],
  fetchOnClient = false,
}) {
  const { subscribed } = useSubscription();
  const { showNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchedComments, setFetchedComments] = useState([]);

  useEffect(() => {
    if (fetchOnClient) {
      (async () => {
        const list = await commentsList(type, target);
        setFetchedComments(list);
      })();
    }
  }, [fetchOnClient, target, type]);

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: commentFormValues,
    resolver: yupResolver(commentValidator),
  });

  useEffect(() => {
    if (showForm && subscribed)
      setValue("email", subscribed, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
  }, [setValue, showForm, subscribed]);

  const submitComment = async (values) => {
    const commentDoc = {
      ...values,
      date: Timestamp.fromDate(new Date()),
      type,
      target,
      approved: false,
    };
    setSubmitting(true);
    try {
      const ref = collection(store, "comments");
      await addDoc(ref, commentDoc);
      setShowForm(false);
      reset();
      showNotification({
        title: "Comment Submitted for review",
        body: "Your comment will be public once reviewed & moderated.",
        classNames: "bg-success text-dark",
        icon: <IconCheck size={24} />,
      });
    } catch (error) {
      showNotification({
        title: "Failed to submit comment",
        body: "Your comment will be public once reviewed & moderated.",
        classNames: "bg-danger text-dark",
        icon: <IconX size={24} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cancelComment = () => {
    reset();
    setShowForm(false);
  };

  return (
    <>
      <h2 className="text-primary mb-4 mt-2">
        {COMMENT_HEADER} {title ? <>&ldquo;{title}&rdquo;</> : "this story"}
      </h2>
      {showForm && (
        <form
          className={styles.form}
          noValidate
          onSubmit={handleSubmit(submitComment)}
        >
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  autoFocus
                  {...register("userName")}
                  className={`form-control ${
                    errors.userName ? "is-invalid" : ""
                  }`}
                  placeholder="Your Name"
                />
                <label htmlFor="userName">Your Name</label>
                {errors.userName && (
                  <div className="invalid-feedback">
                    {errors.userName.message}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Email Address"
                />
                <label htmlFor="emailId">Email Address</label>
                {errors.email ? (
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                ) : (
                  <div className="form-text small fst-italic">
                    (Optional) Your Email ID will not be published.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...register("title")}
              placeholder="Comment Title"
            />
            <label htmlFor="commentTitle">Comment Title</label>
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>
          <div className="form-floating">
            <textarea
              className={`form-control ${errors.body ? "is-invalid" : ""}`}
              {...register("body")}
              placeholder="Comment Body"
              style={{ height: "100px" }}
            ></textarea>
            <label htmlFor="commentBody">Comment Body</label>
            {errors.body && (
              <div className="invalid-feedback">{errors.body.message}</div>
            )}
          </div>
          <p className="my-2 small text-muted">{COMMENT_NOTICE}</p>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-light btn-sm icon-left"
              disabled={submitting}
              onClick={cancelComment}
            >
              <IconX size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary btn-sm icon-left ${
                submitting ? "loading" : ""
              }`}
              disabled={submitting}
            >
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <IconSend size={18} />
              Add Comment
            </button>
          </div>
        </form>
      )}
      {(fetchOnClient ? fetchedComments : comments).length === 0 ? (
        <>
          {!showForm ? (
            <div className="d-flex justify-content-center align-items-center flex-column py-4">
              <Image
                width="auto"
                src={noComments}
                alt="no-comments-yet"
                className="mb-n4 mb-md-3 w-100"
              />
              <p className="h5 text-center">
                Add the first comment to{" "}
                {title ? <>&ldquo;{title}&rdquo;</> : "this story"}
              </p>
              <button
                className="btn btn-sm btn-primary icon-right mt-3"
                onClick={() => setShowForm(!showForm)}
              >
                Add Comment
                <IconMessagePlus size={18} />
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {!showForm && (
            <div className="d-flex justify-content-end pb-3">
              <button
                className="btn btn-sm btn-primary icon-right"
                onClick={() => setShowForm(!showForm)}
              >
                Add Comment
                <IconMessagePlus size={18} />
              </button>
            </div>
          )}
          {(fetchOnClient ? fetchedComments : comments).map((comment) => (
            <div className={styles.comment} key={comment.id}>
              <h5 className="text-light">{comment.userName}</h5>
              <p className="text-muted small fst-italic mb-1">
                {dayjs(comment.date).format(DATE_FORMATS.dateTime)}
              </p>
              <h4>{comment.title}</h4>
              <p className="mb-0">{comment.body}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
