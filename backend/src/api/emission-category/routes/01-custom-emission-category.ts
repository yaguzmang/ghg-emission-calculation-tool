export default {
  routes: [
    {
      method: "GET",
      path: "/emission-categories/with-emissions",
      handler: "emission-category.findWithEmissions",
    },
  ],
};
