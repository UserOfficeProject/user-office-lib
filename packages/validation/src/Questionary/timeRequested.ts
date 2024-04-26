import * as Yup from 'yup';

export const timeRequestedQuestionValidationSchema = (field: any) => {
  const config = field.config;

  let valueScheme = Yup.number()
    .typeError('Value must be a number')
    .nullable()
    .moreThan(0, 'Value cannot be zero/negative');

  if (config.required) {
    valueScheme = valueScheme.required('This is a required field');
  }

  return valueScheme;
};
