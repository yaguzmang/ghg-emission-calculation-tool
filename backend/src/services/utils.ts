import * as yup from "yup";

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
    throw new throwable(errorMessage + err.message);
  }
};
