import {
  UnknownQueryPayloadType,
  QueryParamType,
  query,
  QUERY_METHOD,
  QueryResponseType,
} from './utils/httpQuerys';
import { resetLoggedInStoreData } from './utils/isLoggedIn';

/** APP-SPECIFIC QUERY WRAPPER
 * add app-specific logic here
 */
export const apiQuery = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown
>(
  method: QUERY_METHOD,
  params: QueryParamType<PayloadType>
): Promise<QueryResponseType<ResponseType>> => {
  const res = await query<PayloadType, ResponseType>(method, params);

  if (res.status === 401) {
    // do something
    resetLoggedInStoreData();
    // redirect to login page
  }
  return res;
};

// export const redirectToLoginPageIfTokenIsExpired = (
//   error: AxiosError<any, { data: { msg: string } }>
// ) => {};
