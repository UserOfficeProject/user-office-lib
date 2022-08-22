import { UserinfoResponse } from 'openid-client';

import { RequiredField } from './utilityTypes/RequiredField';

export type ValidUserInfo = RequiredField<
  UserinfoResponse,
  'sub' | 'given_name' | 'family_name' | 'email'
>;
