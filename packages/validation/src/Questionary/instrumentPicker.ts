import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/types';

export const instrumentPickerValidationSchema = (field: any) => {
  const config = field.config;

  let schema:
    | Yup.ArraySchema<
        Yup.NumberSchema<number | null | undefined>,
        AnyObject,
        (number | undefined)[] | null | undefined
      >
    | Yup.NumberSchema<number | null | undefined>;

  if (config.isMultipleSelect) {
    schema = Yup.array().of(Yup.number()).nullable();

    if (config.required) {
      schema = schema.required().min(1);
    }
  } else {
    schema = Yup.number().positive().integer().nullable();

    if (config.required) {
      schema = schema.required();
    }
  }

  return schema;
};
