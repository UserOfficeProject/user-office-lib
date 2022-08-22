import { TokenSet } from 'openid-client';

import { RequiredField } from './utilityTypes/RequiredField';

export type ValidTokenSet = RequiredField<TokenSet, 'access_token'>;
