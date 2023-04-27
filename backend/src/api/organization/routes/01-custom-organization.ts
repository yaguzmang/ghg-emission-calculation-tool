export default {
  routes: [
    {
      method: "GET",
      path: "/organizations/:id/reporting-periods",
      handler: "organization.findReportingPeriods",
      config: {
        middlewares: ["global::valid-id"],
      },
    },
  ],
};