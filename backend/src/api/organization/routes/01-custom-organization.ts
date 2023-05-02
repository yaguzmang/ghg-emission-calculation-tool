export default {
  routes: [
    {
      method: "GET",
      path: "/organizations/:id/reporting-periods",
      handler: "organization.findReportingPeriods",
      config: {
        middlewares: [
          "global::valid-id",
          {
            name: "global::has-access",
            config: { uid: "api::organization.organization" },
          },
        ],
      },
    },
  ],
};
