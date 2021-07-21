import * as Yup from 'yup';

export const textInputQuestionValidationSchema = (field: any) => {
  let schema = Yup.string();
  const config = field.config;
  config.required && (schema = schema.required('This is a required field'));
  config.min &&
    (schema = schema.min(
      config.min,
      `Value must be at least ${config.min} characters`
    ));
  config.max &&
    (schema = schema.max(
      config.max,
      `Value must be at most ${config.max} characters`
    ));

  return schema;
};
