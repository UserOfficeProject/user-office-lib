import * as Yup from 'yup';

export const numberInputQuestionValidationSchema = (
  field: any,
  NumberValueConstraint: any
) => {
  const config = field.config;

  let valueScheme = Yup.number().transform((value: any) =>
    isNaN(value) ? undefined : value
  );

  if (config.required) {
    valueScheme = valueScheme.required('This is a required field');
  }

  if (config.numberValueConstraint === NumberValueConstraint.ONLY_NEGATIVE) {
    valueScheme = valueScheme.negative('Value must be a negative number');
  }

  if (config.numberValueConstraint === NumberValueConstraint.ONLY_POSITIVE) {
    valueScheme = valueScheme.positive('Value must be a positive number');
  }

  let unitScheme = Yup.object().nullable();

  // available units are specified and the field is required
  if (config.units?.length && config.required) {
    unitScheme = unitScheme.required('Please specify unit');
  }

  return Yup.object().shape({
    value: valueScheme,
    unit: unitScheme,
  });
};
