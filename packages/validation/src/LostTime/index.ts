import moment from 'moment';
import * as Yup from 'yup';

import {
  TZ_LESS_DATE_TIME_FORMAT,
  TYPE_ERR_INVALID_DATE,
  NumericalID,
  ID,
  atOrLaterThanMsg,
} from '../util';

// re-use the same validation logic
export const bulkUpsertLostTimeValidationSchema = Yup.object().shape({
  proposalBookingId: NumericalID.required('ProposalBooking ID is required'),
  lostTimes: Yup.array()
    .of(
      Yup.object().shape({
        id: ID.required('LostTime ID is required'),
        startsAt: Yup.date()
          .typeError(TYPE_ERR_INVALID_DATE)
          .required(),

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
      })
    )
    .max(50), // hard limit
});
