import { createContext, useRef, useState } from "react";
import styles from "../styles/modules/Notification.module.scss";

export const NotificationContext = createContext({
  showNotification: ({
    title = "",
    body = "",
    classNames = "",
    icon = null,
    dismissible = false,
  }) => null,
});

const requiredClassNames = [
  "toast",
  "Notification_tpd-toast",
  "fade",
  "hide",
  "show",
];

export function NotificationsProvider({ children }) {
  const toastContainer = useRef();
  const [content, setContent] = useState({
    title: "",
    body: "",
    classNames: "",
    icon: null,
    dismissible: false,
  });

  const hideNotif = () => {
    const { Toast } = require("bootstrap");
    let toast = null;
    if (!toast)
      toast = new Toast(toastContainer.current, {
        autohide: false,
      });

    toast.hide();

    setTimeout(() => {
      toastContainer.current.classList.forEach((cls) => {
        if (!requiredClassNames.find((s) => cls.startsWith(s))) {
          toastContainer.current.classList.remove(cls);
        }
      });
      setContent({
        title: "",
        body: "",
        classNames: "",
        icon: null,
        dismissible: false,
      });
    }, 500);
  };

  const showNotification = ({
    title = "",
    body = "",
    classNames = "",
    icon = null,
    dismissible = false,
  }) => {
    setContent({ title, body, icon, classNames, dismissible });
    const { Toast } = require("bootstrap");
    let toast = null;
    if (!toast)
      toast = new Toast(toastContainer.current, {
        autohide: false,
      });
    toast.show();
    toastContainer.current.classList.add(...classNames.split(" "));

    setTimeout(() => {
      hideNotif();
    }, 3500);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <div
        className={`toast ${styles["tpd-toast"]}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref={toastContainer}
      >
        {content.title && (
          <div className="toast-header">
            {content.icon}
            <strong className="me-auto">{content.title}</strong>
            {content.dismissible && (
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={hideNotif}
              ></button>
            )}
          </div>
        )}
        {content.body && <div className="toast-body">{content.body}</div>}
      </div>
      {children}
    </NotificationContext.Provider>
  );
}
