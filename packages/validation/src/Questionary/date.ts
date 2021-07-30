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
  let schema;
  const config = field.config;

  if (config.required) {
    schema = Yup.date()
      .required('This field is required')
      .transform(function (value: Date) {
        return normalizeDate(value);
      });
  } else {
    schema = Yup.date().nullable();
  }

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
