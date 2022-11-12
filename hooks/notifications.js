import { useContext } from "react";
import { NotificationContext } from "../context/Notification";

export function useNotifications() {
  return useContext(NotificationContext);
}
