import * as yup from "yup";

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
    throw new throwable(errorMessage ?? err.message);
  }
};
