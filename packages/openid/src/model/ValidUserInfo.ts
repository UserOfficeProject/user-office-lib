import { UserinfoResponse } from 'openid-client';

import { RequiredField } from '../types/RequiredField';

export type ValidUserInfo = RequiredField<
  UserinfoResponse,
  'sub' | 'given_name' | 'family_name' | 'email'
>;
