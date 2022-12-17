import { APP_TITLE } from "@constants/app";
import { store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@hooks/media-query";
import { useNotifications } from "@hooks/notifications";
import submitWork from "@images/submissions-artwork.svg";
import { submissionFormValues, submissionValidator } from "@lib/validators";
import {
  IconCheck,
  IconChecks,
  IconMailFast,
  IconSend,
  IconX,
} from "@tabler/icons";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { NextSeo } from "next-seo";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import styles from "../styles/modules/Submissions.module.scss";

export default function Submissions() {
  const { showNotification } = useNotifications();
  const isLargeScreen = useMediaQuery("md");
  const modalRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const focusFirstInput = (e) => {
      e.target.querySelector(".form-control").focus();
    };
    if (modalRef.current)
      modalRef.current.addEventListener("shown.bs.modal", focusFirstInput);
  }, []);

  const showSubmissionForm = () => {
    const { Modal } = require("bootstrap");
    const formModal = new Modal(modalRef.current, {
      backdrop: "static",
      focus: true,
    });
    formModal.show();
  };

  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: submissionFormValues,
    resolver: yupResolver(submissionValidator),
  });

  const closeForm = () => {
    const { Modal } = require("bootstrap");
    const formModal = Modal.getInstance(modalRef.current);
    formModal.hide();
    reset();
  };

  const submitIdea = async (values) => {
    setSubmitting(true);
    try {
      const collectionRef = collection(store, "submissions");
      await addDoc(collectionRef, {
        ...values,
        submittedOn: Timestamp.fromDate(new Date()),
        discussed: false,
        used: false,
      });
      showNotification({
        title: "Submission successful",
        body: "Your submission was successful, we'll get back to you within 24 hours.",
        icon: <IconCheck size={18} />,
        classNames: "bg-success text-dark",
      });
    } catch (error) {
      showNotification({
        title: "Submission failed",
        body: "The submission failed, please try again or send me a message through the about page about the issue.",
        icon: <IconCheck size={18} />,
        classNames: "bg-danger text-dark",
      });
    } finally {
      setSubmitting(false);
      closeForm();
    }
  };

  return (
    <>
      <NextSeo
        title="Submit your Work"
        description={`Get your work featured on ${APP_TITLE}`}
      />
      <div className={styles.subs}>
        <div
          className={`container-fluid shadow pb-4 bg-secondary ${styles.subs__header}`}
        >
          <div className="container px-0">
            <div className="row align-items-center">
              <div className="col-md-6 py-5 py-md-0">
                <h1 className="display-2">
                  Do you have an interesting thought?
                </h1>
                <h4 className="mb-4">
                  That you would like to share on {APP_TITLE}...
                </h4>
                <button
                  className="btn btn-lg btn-primary shadow icon-right"
                  onClick={showSubmissionForm}
                >
                  Share it with us
                  <IconMailFast size={32} />
                </button>
                <p className="small text-dark mt-3 ms-3 d-block d-md-none">
                  Check out FAQ&apos;s below
                </p>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-center">
                <Image
                  src={submitWork}
                  width={isLargeScreen ? 512 : 330}
                  blurDataURL={submitWork.blurDataURL}
                  alt="submit-work-artwork"
                  className="mb-3"
                />
              </div>
            </div>
          </div>
        </div>
        {/* FAQs */}
        <div className="container-fluid py-4">
          <div className="container px-0">
            <h2 className="text-primary">FAQs for submitting content</h2>
            <div className={`accordion ${styles.acc}`} id="submissionsFAQ">
              <div className={`accordion-item shadow ${styles.acc__item}`}>
                <h4
                  className={`accordion-header ${styles.acc__header}`}
                  id="headingOne"
                >
                  <button
                    className={`accordion-button ${styles.acc__button}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    How do I submit content to {APP_TITLE}?
                  </button>
                </h4>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#submissionsFAQ"
                >
                  <div className="accordion-body">
                    <div className="list-group list-group-flush">
                      <div className={`list-group-item ${styles.litem}`}>
                        <span className="text-success me-3">
                          <IconChecks size={18} />
                        </span>
                        <span>
                          Simply click the{" "}
                          <span className="text-primary">Share it with us</span>{" "}
                          button above
                        </span>
                      </div>
                      <div className={`list-group-item ${styles.litem}`}>
                        <span className="text-success me-3">
                          <IconChecks size={18} />
                        </span>
                        <span>
                          Fill out little information about you and your idea.
                          Make sure to provide a valid email address.
                        </span>
                      </div>
                      <div className={`list-group-item ${styles.litem}`}>
                        <span className="text-success me-3">
                          <IconChecks size={18} />
                        </span>
                        <span>
                          We will reach out to you on the mail, requesting the
                          complete content and few other details relating to
                          your composition.
                        </span>
                      </div>
                      <div className={`list-group-item ${styles.litem}`}>
                        <span className="text-success me-3">
                          <IconChecks size={18} />
                        </span>
                        <span>
                          And that&rsquo;s it. Your post is ready to be
                          published on {APP_TITLE}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`accordion-item shadow ${styles.acc__item}`}>
                <h4
                  className={`accordion-header ${styles.acc__header}`}
                  id="heading2"
                >
                  <button
                    className={`accordion-button ${styles.acc__button}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse2"
                    aria-controls="collapse2"
                  >
                    What kind of submissions does {APP_TITLE} accept?
                  </button>
                </h4>
                <div
                  id="collapse2"
                  className="accordion-collapse collapse"
                  aria-labelledby="heading2"
                  data-bs-parent="#submissionsFAQ"
                >
                  <div className="accordion-body">
                    <p>
                      We accept all sorts of thoughts relating to life for
                      single posts,{" "}
                      <span className="fw-bold">
                        Thoughtful Ideas, Short Stories, Poems, Non-fiction,
                      </span>
                      or if you have something else in mind and you would like
                      to talk more,{" "}
                      {/* <Link className="text-decoration-none" href="/about"> */}
                      let&rsquo;s talk...
                      {/* </Link> */}
                    </p>
                    <p>
                      {APP_TITLE} publishes content of a specific type, and we
                      go through all submissions carefully before posting. Hence
                      we encourage contributors to go through our current
                      content and get a taste of the type of content we post
                      before submitting your work.
                    </p>
                    <p className="mb-0">
                      <span className="text-danger fw-bold">NOTE: </span>
                      We highly encourage original submissions, and expect our
                      contributors to submit content that they own completely.
                    </p>
                  </div>
                </div>
              </div>
              <div className={`accordion-item shadow ${styles.acc__item}`}>
                <h4
                  className={`accordion-header ${styles.acc__header}`}
                  id="heading3"
                >
                  <button
                    className={`accordion-button ${styles.acc__button}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse3"
                    aria-controls="collapse3"
                  >
                    Do you accept submissions in any language or format?
                  </button>
                </h4>
                <div
                  id="collapse3"
                  className="accordion-collapse collapse"
                  aria-labelledby="heading3"
                  data-bs-parent="#submissionsFAQ"
                >
                  <div className="accordion-body">
                    <p>
                      {APP_TITLE} is intended to be primarily in English, but we
                      will definitely not skip something just because it is in a
                      diffent language. Send in your content, irrespective of
                      the language, and we will look it over definitely. As for
                      formats, any supported text format is fine if it can be
                      read on a digital media. I will try to respect the source
                      formatting as closely as possible, and will get a review
                      from you before actually publishing it.
                    </p>
                  </div>
                </div>
              </div>
              <div className={`accordion-item shadow ${styles.acc__item}`}>
                <h4
                  className={`accordion-header ${styles.acc__header}`}
                  id="heading4"
                >
                  <button
                    className={`accordion-button ${styles.acc__button}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse4"
                    aria-controls="collapse4"
                  >
                    What is in it for me if I post something to {APP_TITLE}?
                  </button>
                </h4>
                <div
                  id="collapse4"
                  className="accordion-collapse collapse "
                  aria-labelledby="heading4"
                  data-bs-parent="#submissionsFAQ"
                >
                  <div className="accordion-body">
                    <p>
                      <span className="fw-bold">
                        {APP_TITLE} is a privately owned non-profit blog.
                      </span>
                      As such, as of today, we do not promise any rewards or
                      compensations for submitting to our platform. However, if{" "}
                      {APP_TITLE} becomes profitable sometime in the future, we
                      will not forget our contributors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="ideaFormLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable">
          <form
            noValidate
            className="modal-content"
            onSubmit={handleSubmit(submitIdea)}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="ideaFormLabel">
                Submit Your Idea
              </h5>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    errors.userName ? "is-invalid" : ""
                  }`}
                  {...register("userName")}
                  placeholder="Full Name"
                />
                <label htmlFor="commentTitle">Full Name</label>
                {errors.userName && (
                  <div className="invalid-feedback">
                    {errors.userName.message}
                  </div>
                )}
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    errors.emailId ? "is-invalid" : ""
                  }`}
                  {...register("emailId")}
                  placeholder="Email Address"
                />
                <label htmlFor="commentTitle">Email Address</label>
                {errors.emailId && (
                  <div className="invalid-feedback">
                    {errors.emailId.message}
                  </div>
                )}
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${
                    errors.ideaTitle ? "is-invalid" : ""
                  }`}
                  {...register("ideaTitle")}
                  placeholder="Title of your Idea"
                />
                <label htmlFor="commentTitle">Title of your Idea</label>
                {errors.ideaTitle && (
                  <div className="invalid-feedback">
                    {errors.ideaTitle.message}
                  </div>
                )}
                <div className="form-text small fst-italic text-end">
                  {watch("ideaTitle").length}/180 characters
                </div>
              </div>
              <div className="form-floating">
                <textarea
                  className={`form-control ${
                    errors.ideaDescription ? "is-invalid" : ""
                  }`}
                  {...register("ideaDescription")}
                  placeholder="Brief Ddescription"
                  style={{ height: "220px" }}
                ></textarea>
                <label htmlFor="commentBody">Brief Ddescription</label>
                {errors.ideaDescription && (
                  <div className="invalid-feedback">
                    {errors.ideaDescription.message}
                  </div>
                )}
                <div className="form-text small fst-italic text-end">
                  {watch("ideaDescription").length}/1000 characters
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-primary icon-left"
                onClick={closeForm}
              >
                <IconX size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary icon-right ${
                  submitting ? "loading" : ""
                }`}
              >
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Submit
                <IconSend size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
