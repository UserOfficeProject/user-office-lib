import * as Yup from 'yup';

function normalizeDate(date: string | Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
}

export const dateQuestionValidationSchema = (field: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  let schema = Yup.date().nullable().typeError('Invalid Date Format');
  const config = field.config;

  config.required && (schema = schema.required('This field is required'));

  schema = Yup.date().transform(function (value: Date) {
    return normalizeDate(value);
  });

  if (config.minDate) {
    const minDate = normalizeDate(config.minDate);

    schema = schema.min(
      minDate,
      `Date must be no earlier than ${new Date(minDate).toLocaleDateString(
        'en-GB',
        options
      )}`
    );
  }

  if (config.maxDate) {
    const maxDate = normalizeDate(config.maxDate);
    schema = schema.max(
      maxDate,
      `Date must be no latter than ${new Date(maxDate).toLocaleDateString(
        'en-GB',
        options
      )}`
    );
  }

  return schema;
};
