import Image from "next/image";
import React, { useState, useEffect } from "react";
import { APP_TITLE } from "../../constants/app.constants";
import { useMediaQuery } from "../../hooks/media-query";
import profilePic from "../../resources/images/about-1.png";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { firestoreClient } from "../../firebase/clientConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons";
import { useNotifications } from "../../hooks/notifications";
import Alert from "../alert/Alert";

export default function AboutHome() {
  const isLargeScreen = useMediaQuery("md");
  const { showNotification } = useNotifications();
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("subscribed"))
      setSubscribed(sessionStorage.getItem("subscribed"));
  }, []);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Please enter a valid email ID.")
          .required("Please enter an Email ID."),
      })
    ),
  });

  const subscribe = async ({ email }) => {
    setSubscribing(true);
    try {
      const subscriptions = collection(firestoreClient, "subscriptions");
      const q = query(
        collection(firestoreClient, "subscriptions"),
        where("email", "==", email)
      );
      const sub = await getDocs(q);
      if (sub.docs.length > 0) {
        showNotification({
          title: "Already Subscribed",
          body: `You are already subscribed to ${APP_TITLE}`,
          classNames: "bg-info text-dark",
          icon: <IconInfoCircle size={18} />,
        });
      } else {
        await addDoc(subscriptions, { email });
        showNotification({
          title: "Subscribed",
          body: `You are successfully subscribed to ${APP_TITLE}`,
          classNames: "bg-success text-dark",
          icon: <IconCheck size={18} />,
        });
        reset();
        setSubscribed(email);
        sessionStorage.setItem("subscribed", email);
      }
    } catch (error) {
      showNotification({
        title: "Failed to subscribe",
        body: "Your subscription failed, please try again, or sedn me a message from the about page.",
        classNames: "bg-danger text-dark",
        icon: <IconCheck size={18} />,
      });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="container-fluid py-3 shadow">
      <div className="container px-0">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center">
            <Image
              src={profilePic}
              width={isLargeScreen ? 512 : 330}
              blurDataURL={profilePic.blurDataURL}
              alt="Amittras' Profile Image"
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h1 className="display-3 text-primary">Hi! I Am Amittras.</h1>
            <p>
              {APP_TITLE} is a place where I pen down the thoughts that come to
              my mind from all around me. I turn them to stories, sometimes
              little thoughts, and sometimes just a mess of words.
            </p>
            <p>
              Come along if you too want to sneak a peek into the dark,
              sometimes funny, mostly twisted thinking process of my mind...
            </p>
            <p>Find Stories down below....</p>
            {subscribed ? (
              <Alert variant="info">
                <span className="me-2">
                  <IconCircleCheck size={24} />
                </span>
                <span className="mb-0">Your email </span>
                <span className="fw-bold mb-0">
                  &lsquo;{subscribed}&rsquo;{" "}
                </span>
                <span className="mb-0"> is subscribed to {APP_TITLE}</span>
              </Alert>
            ) : (
              <form
                className="row mt-3 align-items-center mb-3 mb-md-0"
                noValidate
                onSubmit={handleSubmit(subscribe)}>
                <div className="col-md-9">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      {...register("email")}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email Address *"
                    />
                    <label htmlFor="email">Email Address *</label>
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <button
                    className={`btn btn-primary rounded w-100 icon-right ${
                      subscribing ? "loading" : ""
                    }`}
                    type="submit">
                    <div className="spinner-border text-dark" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Subscribe
                    <IconArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
            <p className="small text-muted fst-italic mb-3 mb-md-0">
              You will be notified of new posts once a month via this email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
