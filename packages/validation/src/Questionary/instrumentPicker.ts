import * as Yup from 'yup';

export const instrumentPickerValidationSchema = (field: any) => {
  const config = field.config;

  let schema = Yup.array().of(Yup.number()).nullable();

  if (config.required) {
    schema = schema.required().min(1);
  }

  return schema;
};
