/**
 * This middleware deletes emission entries related to a reporting period.
 * Before that it checks that the URL includes `?force=true` in the query.
 * (Batch removing emission entries is something we don't want to do by accident.)
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";

const { ValidationError, ApplicationError } = utils.errors;

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const paramsSchema = yup.object({
      id: yup.number().required(),
    });

    // Let's be sure that the caller knows what they are doing by requiring `?force=true` in the query
    const querySchema = yup.object({
      force: yup.boolean().required().oneOf([true]),
    });

    const [{ id }] = await Promise.all([
      validate(ctx.params, paramsSchema, ValidationError),
      validate(
        ctx.query,
        querySchema,
        ValidationError,
        "?force=true is required"
      ),
    ]);

    // Remove all emission entries associated with this reporting period

    // 1. Get emission entry ids

    interface IdOnly {
      id: number;
    }

    const entries: IdOnly[] | undefined = await strapi.entityService?.findMany(
      "api::emission-entry.emission-entry",
      {
        fields: ["id"],
        filters: {
          reportingPeriod: { id },
        },
      }
    );

    if (!entries) {
      throw new ApplicationError();
    }

    const ids = entries.map((_) => _.id);

    // 2. Asynchronously delete emission entries by id

    const removed = await Promise.all(
      ids.map(async (id) => {
        return (await strapi.entityService?.delete(
          "api::emission-entry.emission-entry",
          id,
          {
            fields: ["id"],
          }
        )) as { id: number } | undefined;
      })
    );

    const removedIds = removed.map((_) => _?.id).filter((_) => !!_) as number[];

    // Hat tip: https://2ality.com/2015/01/es6-set-operations.html#difference
    const notRemoved = ids.filter((id) => !removedIds.includes(id));

    if (notRemoved.length > 0) {
      strapi.log.error(
        `Failed to delete emission entries ${JSON.stringify(
          notRemoved
        )} for reporting period ${id}`
      );
      ctx.status = 500;
      ctx.body = {
        message:
          "Failed to delete all emission entries. The reporting period was not deleted.",
        notRemoved,
      };
    } else {
      await next();
    }
  };
};
