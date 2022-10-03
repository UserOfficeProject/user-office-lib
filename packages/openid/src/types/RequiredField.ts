import { NonNullableFields } from './NonNullableFields';

/**
 * @description Makes subset fields required
 */

export type RequiredField<T, K extends keyof T> = T &
  NonNullableFields<Required<Pick<T, K>>>;
