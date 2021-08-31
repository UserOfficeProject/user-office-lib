import moment from 'moment';
import * as Yup from 'yup';

import {
  TZ_LESS_DATE_TIME_FORMAT,
  TYPE_ERR_INVALID_DATE,
  atOrLaterThanMsg,
} from '../util';

export const equipmentValidationSchema = Yup.object().shape({
  name: Yup.string().min(3).max(100).required(),

  maintenanceStartsAt: Yup.date()
    .nullable()
    .typeError(TYPE_ERR_INVALID_DATE)
    .notRequired(),

  maintenanceEndsAt: Yup.date()
    .nullable()
    .typeError(TYPE_ERR_INVALID_DATE)
    .when(
      'maintenanceStartsAt',
      (
        maintenanceStartsAt: Date,
        schema: Yup.DateSchema<Date | null | undefined>
      ) => {
        if (!maintenanceStartsAt) {
          return schema;
        }

        const min = moment(maintenanceStartsAt).add(1, 'minute');

        if (!min.isValid()) {
          return schema;
        }

        return schema
          .nullable()
          .typeError(TYPE_ERR_INVALID_DATE)
          .min(
            min.toDate(),
            atOrLaterThanMsg(min.format(TZ_LESS_DATE_TIME_FORMAT))
          )
          .notRequired();
      }
    )
    .notRequired(),
});
