import moment from 'moment';
import * as Yup from 'yup';

const TZ_LESS_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';

export const createScheduledEventValidationSchema = (
  bookingTypesMap: Record<string, string>
) =>
  Yup.object().shape({
    bookingType: Yup.string()
      .oneOf(
        Object.keys(bookingTypesMap),
        `Must be one of the following values: ${Object.values(
          bookingTypesMap
        ).join(', ')}`
      )
      .required('Booking type is required'),

    startsAt: Yup.date()
      .typeError('Invalid Date Format')
      .required(),

    endsAt: Yup.date()
      .typeError('Invalid Date Format')
      .when('startsAt', (startsAt: Date) => {
        const min = moment(startsAt).add(1, 'hour');

        return Yup.date().min(
          min.toDate(),
          () =>
            `Must be at or later than ${min.format(TZ_LESS_DATE_TIME_FORMAT)}`
        );
      })
      .required(),

    description: Yup.string()
      .max(30, ({ max }) => `Must be at most ${max} characters`)
      .nullable(),
  });
