import * as Yup from 'yup';

export const fileUploadQuestionValidationSchema = (field: any) => {
  const config = field.config;

  let schema = Yup.array().of(
    Yup.object({ id: Yup.string().required() }).required()
  );

  config.required &&
    (schema = schema.required('This is a required field').min(1));

  config.max_files &&
    (schema = schema.max(config.max_files, `Max ${config.max} files`));

  return schema;
};
