import moment from 'moment';
import * as Yup from 'yup';

import {
  TZ_LESS_DATE_TIME_FORMAT,
  TYPE_ERR_INVALID_DATE,
  maxCharactersMsg,
  oneOfMsg,
  atOrLaterThanMsg,
} from '../util';

export const createScheduledEventValidationSchema = (
  bookingTypesMap: Record<string, string>
) =>
  Yup.object().shape({
    bookingType: Yup.string()
      .oneOf(Object.keys(bookingTypesMap), oneOfMsg(bookingTypesMap))
      .required('Booking type is required'),

    startsAt: Yup.date().typeError(TYPE_ERR_INVALID_DATE).required(),

    endsAt: Yup.date()
      .typeError(TYPE_ERR_INVALID_DATE)
      .when('startsAt', (startsAt: Date) => {
        const min = moment(startsAt).add(1, 'minute');

        return Yup.date().min(
          min.toDate(),
          atOrLaterThanMsg(min.format(TZ_LESS_DATE_TIME_FORMAT))
        );
      })
      .required(),

    description: Yup.string().max(30, maxCharactersMsg).nullable(),
  });
