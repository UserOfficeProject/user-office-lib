import * as Yup from 'yup';

export const instrumentPickerValidationSchema = (field: any) => {
  const config = field.config;

  let schema = Yup.number().positive().integer();

  if (config.required) {
    schema = schema.required();
  }

  return schema;
};
