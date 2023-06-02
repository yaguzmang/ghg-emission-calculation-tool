import React from "react";
import { LinkButton } from "@strapi/helper-plugin";

const PullDataButton = () => {
  const [uid, id] = window.location.pathname.split("/").slice(-2);

  return (
    uid === "api::emission-factor-datum.emission-factor-datum" && (
      <LinkButton to="#">Pull data from EF API</LinkButton>
    )
  );
};

export default {
  bootstrap(app) {
    console.log("bootstrap");
    app.injectContentManagerComponent("editView", "right-links", {
      name: "pull-ef-data",
      Component: () => <PullDataButton />,
    });
  },
};
