import { TokenSet } from 'openid-client';

import { RequiredField } from '../types/RequiredField';

export type ValidTokenSet = RequiredField<TokenSet, 'access_token'>;
