import { DateTime } from 'luxon';
import * as Yup from 'yup';

export const TZ_LESS_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';

export const TYPE_ERR_INVALID_DATE = 'Invalid Date Format';
export const TYPE_ERR_INVALID_DATE_TIME = 'Invalid DateTime Format';

export const minCharactersMsg = ({ min }: { min: number }) =>
  `Must be at least ${min} characters`;
export const maxCharactersMsg = ({ max }: { max: number }) =>
  `Must be at most ${max} characters`;

export const oneOfMsg = (
  types: Record<string, string> | Array<string | number>
) =>
  `Must be one of the following values: ${
    Array.isArray(types) ? types.join(', ') : Object.values(types).join(', ')
  }`;

export const atOrLaterThanMsg = (time: string) =>
  `Must be at or later than ${time}`;

export const ID = Yup.string()
  .min(1, minCharactersMsg)
  .max(15, maxCharactersMsg)
  .typeError('Invalid ID');

export const NumericalID = ID.matches(
  /^[\d]+$/,
  'Invalid NumericalID'
).typeError('Invalid NumericalID');

export const isValidDate = (d: Date) => DateTime.fromJSDate(d).isValid;
