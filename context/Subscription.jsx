import { APP_TITLE, SUB_POPUP_DELAY } from "@constants/app";
import { firebaseApp, store } from "@fb/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotifications } from "@hooks/notifications";
import { getMailCookie, setMailCookie } from "@lib/utils";
import { subscriptionFormValues, subscriptionValidator } from "@lib/validators";
import { IconCheck, IconInfoCircle, IconSend, IconX } from "@tabler/icons";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { createContext } from "react";
import { useForm } from "react-hook-form";

const SubscriptionContext = createContext({
  showForm: () => null,
  subscribing: false,
  subscribed: "",
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
  const modRef = useRef();
  const { showNotification } = useNotifications();
  const [cancelAutoPopup, setCancelAutoPopup] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(null);

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

  useEffect(() => {
    const focusFirstInput = (e) => {
      e.target.querySelector(".form-control").focus();
    };
    if (modRef.current) {
      modRef.current.addEventListener("shown.bs.modal", focusFirstInput);
    }
  }, []);

  useEffect(() => {
    let timeout = null;
    const subscribedUser = getMailCookie();
    if (subscribedUser) setSubscribed(subscribedUser);
    else if (!cancelAutoPopup) {
      timeout = setTimeout(() => {
        const { Modal } = require("bootstrap");
        const formModal = new Modal(modRef.current);
        reset();
        if (formModal) formModal.show();
        else {
          const instance = new Modal(modRef.current);
          instance.show();
        }
      }, SUB_POPUP_DELAY);
    } else {
      clearTimeout(timeout);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [cancelAutoPopup, reset]);

  const showForm = () => {
    reset();
    setCancelAutoPopup(true);
    const { Modal } = require("bootstrap");
    const formModal = Modal.getInstance(modRef.current);
    if (formModal) formModal.show();
    else {
      const { Modal } = require("bootstrap");
      const instance = new Modal(modRef.current);
      instance.show();
    }
  };

  const closeForm = () => {
    const { Modal } = require("bootstrap");
    const formModal = Modal.getInstance(modRef.current);
    formModal.hide();
    reset();
  };

  const subscribe = async (values) => {
    setSubscribing(true);
    try {
      const subscriptions = collection(store, "subscriptions");
      const q = query(
        collection(store, "subscriptions"),
        where("email", "==", values.email)
      );
      const sub = await getDocs(q);
      if (sub.docs.length > 0) {
        showNotification({
          title: "Already Subscribed",
          body: `You are already subscribed to ${APP_TITLE}`,
          classNames: "bg-info text-dark",
          icon: <IconInfoCircle size={18} />,
        });
        setMailCookie(values.email);
        setSubscribed(values.email);
      } else {
        await addDoc(subscriptions, {
          ...values,
          subscribedOn: Timestamp.fromDate(new Date()),
        });
        showNotification({
          title: "Subscribed",
          body: `You are successfully subscribed to ${APP_TITLE}`,
          classNames: "bg-success text-dark",
          icon: <IconCheck size={18} />,
        });
        setSubscribed(values.email);
        setMailCookie(values.email);
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, "sign_up");
      }
    } catch (error) {
      showNotification({
        title: "Failed to subscribe",
        body: "Your subscription failed, please try again, or send me a message regarding the error from the about page.",
        classNames: "bg-danger text-dark",
        icon: <IconCheck size={18} />,
      });
    } finally {
      reset();
      closeForm();
      setSubscribing(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        showForm,
        subscribed,
        subscribing,
      }}
    >
      {children}
      <div
        className="modal fade"
        ref={modRef}
        tabIndex="-1"
        aria-labelledby="subscribeFormLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <form
            noValidate
            className="modal-content"
            onSubmit={handleSubmit(subscribe)}
          >
            <div className="modal-header d-flex jsutify-content-between align-items-center">
              <h5 className="modal-title" id="subscribeFormLabel">
                Subscribe to {APP_TITLE}
              </h5>
              <button
                className="icon-btn border-0 text-danger"
                onClick={closeForm}
              >
                <IconX size={24} />
              </button>
            </div>
            <div className="modal-body pt-0">
              <p className="text-muted">
                Subscribe to {APP_TITLE} newsletter, and receive a monthly
                digest of all new posts & stories, straight to your inbox...
              </p>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name")}
                  placeholder="Full Name"
                />
                <label htmlFor="commentTitle">Full Name</label>
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  {...register("email")}
                  placeholder="Email Address"
                />
                <label htmlFor="commentTitle">Email Address</label>
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
            </div>
            <div className="modal-footer d-flex">
              <button
                type="submit"
                className={`btn btn-sm btn-primary icon-right ms-auto ${
                  subscribing ? "loading" : ""
                }`}
              >
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Subscribe
                <IconSend size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </SubscriptionContext.Provider>
  );
}
