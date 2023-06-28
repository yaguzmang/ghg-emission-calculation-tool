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
  ],
};
