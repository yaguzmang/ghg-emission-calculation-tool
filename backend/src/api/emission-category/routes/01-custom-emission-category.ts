export default {
  routes: [
    {
      method: "GET",
      path: "/emission-categories/:id/with-emission-factors",
      handler: "emission-category.findOneWithEmissionFactors",
    },
    {
      method: "GET",
      path: "/emission-categories/with-emissions",
      handler: "emission-category.findWithEmissions",
    },
  ],
};
