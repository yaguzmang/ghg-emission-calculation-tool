export default {
  routes: [
    {
      method: "POST",
      path: "/emission-entries/csv/validate",
      handler: "emission-entry.importCSV",
    },
    {
      method: "POST",
      path: "/emission-entries/batch",
      config: {
        middlewares: ["api::emission-entry.has-access-to-relations"],
      },
      handler: "emission-entry.batchCreate",
    },
  ],
};
