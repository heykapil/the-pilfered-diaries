import { useSubscription } from "@context/Subscription";
import { IconUserCheck, IconUserPlus } from "@tabler/icons";
import React from "react";

export default function Subscribe({ compact }) {
  const { subscribed, showForm } = useSubscription();

  return (
    <button
      className={`btn btn-${compact ? "sm" : "lg"} ${
        subscribed ? "no-glow btn-outline-success" : "btn-primary shadow"
      } icon-right w-100`}
      onClick={showForm}
      disabled={subscribed}
    >
      {subscribed ? "You are subscribed" : "Subscribe to the newsletter"}
      {subscribed ? <IconUserCheck size={20} /> : <IconUserPlus size={20} />}
    </button>
  );
}
