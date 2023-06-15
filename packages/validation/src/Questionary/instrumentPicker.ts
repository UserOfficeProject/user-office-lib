import * as Yup from 'yup';

export const instrumentPickerValidationSchema = (field: any) => {
  const config = field.config;

  // Value can be a number or null, if not required. If required, it must be a number.
  let schema = Yup.number()
    .positive()
    .integer()
    .nullable()
    .transform((_, val) => (val === Number(val) ? val : null)); // Need to write custom transform to allow null values, else Yup throws NaN error

  if (config.required) {
    schema = schema.required();
  }

  return schema;
};
