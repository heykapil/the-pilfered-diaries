import { NotificationContext } from "@context/Notification";
import { useContext } from "react";

export function useNotifications() {
  return useContext(NotificationContext);
}
