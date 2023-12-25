import { PingUserInfoResponse } from './PingUserInfoResponse';
import { RequiredField } from '../types/RequiredField';

export type ValidUserInfo = RequiredField<
  PingUserInfoResponse,
  | 'sub'
  | 'given_name'
  | 'family_name'
  | 'email'
  | 'institution_name'
  | 'institution_country'
>;
