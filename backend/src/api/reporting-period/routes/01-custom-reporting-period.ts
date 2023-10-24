export default {
  routes: [
    {
      method: "GET",
      path: "/reporting-periods/:id/emissions",
      handler: "reporting-period.getEmissions",
      config: {
        middlewares: [
          {
            name: "global::has-access",
            config: {
              uid: "api::reporting-period.reporting-period",
            },
          },
        ],
      },
    },
    {
      method: "GET",
      path: "/reporting-periods/:id/emission-entries/export",
      handler: "reporting-period.exportEmissionEntries",
      config: {
        middlewares: [
          {
            name: "global::has-access",
            config: {
              uid: "api::reporting-period.reporting-period",
            },
          },
        ],
      },
    },
  ],
};
