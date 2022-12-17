import Alert from "@components/Alert";
import { APP_TITLE, ISR_INTERVAL, SITE_URL } from "@constants/app";
import { store } from "@fb/client";
import firebase from "@fb/server";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@hooks/media-query";
import { useNotifications } from "@hooks/notifications";
import { messageFormValues, messageValidator } from "@lib/validators";
import { IconCheck, IconCircleCheck, IconSend, IconX } from "@tabler/icons";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import styles from "../styles/modules/About.module.scss";

export default function About({ image }) {
  const isLargeScreen = useMediaQuery("md");
  const { showNotification } = useNotifications();

  const [sending, setSending] = useState(false);
  const [sentAMessage, setSentAMessage] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: messageFormValues,
    resolver: yupResolver(messageValidator),
  });

  const sendMessage = async (values) => {
    setSending(true);
    try {
      const messages = collection(store, "messages");
      await addDoc(messages, {
        ...values,
        date: Timestamp.fromDate(new Date()),
        viewed: false,
      });
      setSentAMessage(true);
      sessionStorage.setItem("sentAMessage", true);
      showNotification({
        title: "Your message sent successfully.",
        body: "If required, I'll get back to you on the mail ID you provided.",
        icon: <IconCheck size={18} />,
        classNames: "bg-success text-dark",
      });
    } catch (err) {
      showNotification({
        title: "Failed to send message",
        icon: <IconX />,
        body: "Please try again!",
        classNames: "bg-danger text-dark",
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("sentAMessage")) setSentAMessage(true);
  }, []);

  return (
    <>
      <NextSeo
        title="About the Blog"
        description="About this blog and a little bit about me!"
        openGraph={{
          url: SITE_URL + "/about",
        }}
      />
      <div className={styles.about}>
        <div className={`container ${styles.about__content}`}>
          <div className="row">
            <div className="col-md-6 d-flex justify-content-center">
              <Image
                src={image}
                width={isLargeScreen ? 512 : 330}
                height={isLargeScreen ? 512 : 330}
                alt="Amittras' Profile Image"
              />
            </div>
            <div className="col-md-6 mt-4">
              <p className="text-primary fs-3 mb-2">
                Hi! I am Amittras, and this is
              </p>
              <h1 className="display-1">{APP_TITLE}</h1>
              <p className="fst-italic">
                A blog/showcase of my adventures in the literary space. Ideas,
                that are pilfered from what many call the &ldquo;muse&rdquo; and
                I call the reticent witch. I write stuff, read a lot more, and
                sometimes just explore little thoughts that run through my head
                at the most random hours of the day.
              </p>
              <p className="fst-italic">
                Dark, Twisted, Relatable, and sometimes outright crazy, this
                blog, {APP_TITLE} is an experiment, a journal, a way for me to
                collaborate with people who are like me. More often than not,
                you will find in here something that might make you think. Come
                along with me, on a journey that has a lot of chill breaks, wild
                thoughts, and scenes that make you question the sanity of the
                writer...
              </p>
              <p className="fst-italic">
                Oh, by the way,{" "}
                <span className="fw-bold">Cats are better than dogs, </span>
                change my mind!...
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <p className="fs-4">Exciting stuff around here.</p>
              <Link href="/stories" className={styles.action}>
                <h3>Explore Stories</h3>
                <p className="mb-0 text-muted">
                  I am no accomplished writer, but like many others, I like to
                  cook up scenarios in my head and pen them down sometimes.
                </p>
              </Link>
              <Link href="/posts" className={styles.action}>
                <h3>Explore Short Posts</h3>
                <p className="mb-0 text-muted">
                  Little thoughts, ideas and incidents, that I keep track of,
                  and try to compile into coherent scenarios.
                </p>
              </Link>
              <Link href="/submissions" className={styles.action}>
                <h3>Get Featured</h3>
                <p className="mb-0 text-muted">
                  You can send your work to {APP_TITLE}. Let&apos;s collborate
                  and build a story that originates with you, and showcases
                  here...
                </p>
              </Link>
            </div>
            <div className="col-md-6">
              {sentAMessage ? (
                <>
                  <p className="fs-4 mb-3">Write to me</p>
                  <Alert variant="info">
                    <span className="me-2">
                      <IconCircleCheck size={24} />
                    </span>
                    <span className="mb-0">
                      Your message was sent successfully. I&apos;ll read it
                      soon. And I&apos;ll get back to you on the email you
                      provided if I need to talk more.
                    </span>
                  </Alert>
                </>
              ) : (
                <>
                  <p className="fs-4 mb-2">Write to me</p>
                  <p>
                    Have something to ask? Or have a suggestion? Is there an
                    issue with the website?
                  </p>
                  <form
                    className={styles["message-form"]}
                    noValidate
                    onSubmit={handleSubmit(sendMessage)}
                  >
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        {...register("name")}
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        placeholder="Your Name (required)"
                      />
                      <label htmlFor="name">
                        Your Name <span className="small">(required)</span>
                      </label>
                      {errors.name && (
                        <div className="invalid-feedback">
                          {errors.name.message}
                        </div>
                      )}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        {...register("email")}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Email Address (required)"
                      />
                      <label htmlFor="email">
                        Email Address <span className="small">(required)</span>
                      </label>
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="form-floating">
                      <textarea
                        className={`form-control ${
                          errors.message ? "is-invalid" : ""
                        }`}
                        {...register("message")}
                        placeholder="Your Message, Comment, Suggesstion (required)"
                        style={{ height: "100px" }}
                      ></textarea>
                      <label htmlFor="commentBody">
                        Your Message, Comment, Suggesstion{" "}
                        <span className="small">(required)</span>
                      </label>
                      {errors.message && (
                        <div className="invalid-feedback">
                          {errors.message.message}
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button
                        type="submit"
                        className={`btn btn-primary btn-sm icon-left ${
                          sending ? "loading" : ""
                        }`}
                        disabled={sending}
                      >
                        <div className="spinner-border text-dark" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <IconSend size={18} />
                        Send Message
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const siteImageConfig = await firebase.doc("siteContent/site-config").get();
  const { profileAbout: image } = siteImageConfig.data();

  return {
    props: {
      image,
    },
    revalidate: ISR_INTERVAL * 24 * 30, // revalidate once a month
  };
}
