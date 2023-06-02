export default {
  routes: [
    {
      method: "POST",
      path: "/emission-factor-data/:id/pull",
      handler: "emission-factor-datum.pull",
    },
  ],
};
