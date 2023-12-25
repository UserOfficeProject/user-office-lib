import { UserinfoResponse } from 'openid-client';

export type PingUserInfoResponse = UserinfoResponse<{
  institution_name: string;
  institution_country: string;
  institution_ror_id: string;
}>;
