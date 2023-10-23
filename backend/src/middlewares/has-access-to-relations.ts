/**
 * `has-access-to-relations` middleware
 *
 * A reusable middleware for checking whether the user has access to specified relations
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../services/utils";

const { ValidationError } = utils.errors;

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  const configSchema = yup.object({
    relations: yup
      .array()
      .of(
        yup
          .object({
            key: yup.string().required(),
            uid: yup
              .string()
              .matches(/^api::[a-z-]+.[a-z-]+$/)
              .required(),
          })
          .required()
      )
      .required(),
  });

  return async (ctx, next) => {
    const conf = await configSchema.validate(config);

    const bodySchema = yup.object({
      data: yup.object(
        Object.fromEntries(
          conf.relations.map(({ key }) => [key, yup.number().required()])
        )
      ),
    });

    const { data } = await validate(
      ctx.request.body,
      bodySchema,
      ValidationError
    );

    await Promise.all(
      conf.relations.map(async ({ key, uid }) => {
        const isAllowed: boolean | undefined = await strapi
          .service(uid as `api::${string}.${string}`)
          ?.isAllowedForUser(data[key], ctx.state.user.id);
        if (!isAllowed) throw new ValidationError(`forbidden ${key}`);
      })
    );

    await next();
  };
};
