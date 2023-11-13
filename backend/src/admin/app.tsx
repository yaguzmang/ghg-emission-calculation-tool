import React, { useState } from "react";
import { LinkButton } from "@strapi/helper-plugin";

const PullDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [uid, id] = window.location.pathname.split("/").slice(-2);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure? The existing emission factor data will be overwritten."
      )
    ) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `http://localhost:1337/api/emission-factor-data/${id}/pull`,
      {
        method: "POST",
        headers: {
          "Custom-Endpoint-Secret":
            process.env.STRAPI_ADMIN_CUSTOM_ENDPOINT_SECRET || "",
        },
      }
    );

    setLoading(false);

    if (!res.ok) {
      const body = await res.json();
      window.alert(
        `Emission factor data could not be loaded. Error message: ${body.error.message}`
      );
      return;
    }
    window.location.reload();
  };

  return (
    (uid === "api::emission-factor-datum.emission-factor-datum" && (
      <LinkButton onClick={handleClick} to="#" disabled={loading}>
        {loading ? "Loading..." : "Pull data from EF API"}
      </LinkButton>
    )) ||
    null
  );
};

export default {
  bootstrap(app) {
    app.injectContentManagerComponent("editView", "right-links", {
      name: "pull-ef-data",
      Component: () => <PullDataButton />,
    });
  },
};
