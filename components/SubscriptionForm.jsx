import Alert from "@components/Alert";
import { APP_TITLE } from "@constants/app";
import { firebaseApp, store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotifications } from "@hooks/notifications";
import { subscriptionFormValues, subscriptionValidator } from "@lib/validators";
import {
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SubscriptionForm() {
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
    defaultValues: subscriptionFormValues,
    resolver: yupResolver(subscriptionValidator),
  });

  const subscribe = async ({ email }) => {
    setSubscribing(true);
    try {
      const subscriptions = collection(store, "subscriptions");
      const q = query(
        collection(store, "subscriptions"),
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
        await addDoc(subscriptions, {
          email,
          subscribedOn: Timestamp.fromDate(new Date()),
        });
        showNotification({
          title: "Subscribed",
          body: `You are successfully subscribed to ${APP_TITLE}`,
          classNames: "bg-success text-dark",
          icon: <IconCheck size={18} />,
        });
        reset();
        setSubscribed(email);
        sessionStorage.setItem("subscribed", email);
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, "sign_up");
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
  return subscribed ? (
    <Alert variant="info">
      <span className="me-2">
        <IconCircleCheck size={24} />
      </span>
      <span className="mb-0">Your email </span>
      <span className="fw-bold mb-0">&lsquo;{subscribed}&rsquo; </span>
      <span className="mb-0"> is subscribed to {APP_TITLE}</span>
    </Alert>
  ) : (
    <>
      <p className="fs-4 fst-italic mb-0 text-muted">
        Subscribe to the monthly newsletter; get new content on your email!
      </p>
      <form
        className="row mt-3 align-items-center mb-3 mb-md-0"
        noValidate
        onSubmit={handleSubmit(subscribe)}
      >
        <div className="col-md-9">
          <div className="form-floating mb-3">
            <input
              type="text"
              {...register("email")}
              className={`form-control form-control-sm ${
                errors.email ? "is-invalid" : ""
              }`}
              id="inpSub"
              placeholder="Your Email Address *"
            />
            <label htmlFor="email">Your Email Address *</label>
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <button
            className={`btn btn-primary rounded w-100 icon-right ${
              subscribing ? "loading" : ""
            }`}
            type="submit"
          >
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Subscribe
            <IconArrowRight size={18} />
          </button>
        </div>
      </form>
      <p className="small text-muted fst-italic mb-3 mb-md-0">
        You will be notified of new posts once a month via this email.
      </p>
    </>
  );
}
