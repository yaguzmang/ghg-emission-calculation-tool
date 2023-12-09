export default {
  routes: [
    {
      method: "POST",
      path: "/emission-entries/csv/validate",
      handler: "emission-entry.importCSV",
    },
  ],
};
