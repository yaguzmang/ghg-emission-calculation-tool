/**
 * emission-factor-datum controller
 */

import { factories } from "@strapi/strapi";
import * as yup from "yup";
import { pullEmissionFactorData } from "../../../services/ef-tables";

export default factories.createCoreController(
  "api::emission-factor-datum.emission-factor-datum",
  ({ strapi }) => ({
    async pull(ctx) {
      const ctxSchema = yup.object({
        params: yup.object({
          id: yup.string(),
        }),
      });

      const validatedCtx = await ctxSchema.validate(ctx);

      const id = validatedCtx.params?.id;

      if (!id) return ctx.badRequest("missing id");

      await pullEmissionFactorData(Number(id), strapi);

      ctx.status = 200;
    },
  })
);
