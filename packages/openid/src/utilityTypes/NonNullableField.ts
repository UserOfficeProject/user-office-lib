import { NonNullableFields } from './NonNullableFields';

/**
 * @description Makes subset fields non-nullable
 */

export type NonNullableField<T, K extends keyof T> = T &
  NonNullableFields<Pick<T, K>>;
