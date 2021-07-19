import * as Yup from 'yup';

export const intervalQuestionValidationSchema = (field: any) => {
  const config = field.config;

  let minSchema = Yup.number().transform((value) =>
    isNaN(value) ? undefined : value
  );
  let maxSchema = Yup.number().transform((value) =>
    isNaN(value) ? undefined : value
  );

  if (config.required) {
    minSchema = minSchema.required('This is a required field');
    maxSchema = maxSchema.required('This is a required field');
  }

  let unitSchema = Yup.string().nullable();

  // available units are specified and the field is required
  if (config.units?.length && config.required) {
    unitSchema = unitSchema.required();
  }

  return Yup.object().shape({
    min: minSchema,
    max: maxSchema,
    unit: unitSchema,
  });
};
