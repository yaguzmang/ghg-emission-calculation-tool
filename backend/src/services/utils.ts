import * as yup from "yup";
import Papa from "papaparse";
import utils from "@strapi/utils";

const { ApplicationError, ValidationError } = utils.errors;

/**
 * Validate data against a schema
 * @param data Data to validate
 * @param schema The yup schema to validate against
 * @param error Optional custom error class to throw if the validation fails
 * @param errorMessage Optional custom message to include in the error
 * @returns Validated data
 */
export const validate = async <S extends yup.Schema, E extends Error>(
  data: unknown,
  schema: S,
  error?: new () => E,
  errorMessage = ""
) => {
  try {
    return await schema.validate(data);
  } catch (err) {
    const throwable = error ?? Error;
    throw new throwable(errorMessage || err.message);
  }
};

/**
 * Convert a JSON-compliant JavaScript array of objects to a specified data format
 * @param input {object[]} And array of objects to convert
 * @param format {string} The output format
 * @returns {string} The converted output
 */
export const convertJsonTo = (input: object[], format: string): string => {
  switch (format) {
    case "csv":
      return Papa.unparse(input);
    default:
      throw new ApplicationError(`unknown format ${format}`);
  }
};
