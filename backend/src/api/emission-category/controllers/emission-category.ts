/**
 * emission-category controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";

export default factories.createCoreController(
  "api::emission-category.emission-category",
  ({ strapi }) => ({
    async findWithEmissions(ctx) {
      console.log("findWithEmissions");

      const querySchema = yup.object({
        locale: yup.string().required(),
        reportingPeriod: yup.number().required(),
      });

      const { locale, reportingPeriod } = await validate(
        ctx.query,
        querySchema,
        utils.errors.ValidationError
      );

      console.log(locale, reportingPeriod);
      return;
    },
  })
);
