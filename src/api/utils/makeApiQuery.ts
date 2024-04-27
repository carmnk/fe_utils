import { apiQuery } from '../apiQuery';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type QUERY_METHODS =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'GET_FILE'
  | 'POST_GET_FILE';

export const makeApiQuery = <PayloadType = undefined, ResponseType = any>(
  method: QUERY_METHODS,
  url: string
  // withCredentials = false
) => {
  return {
    query: (payload?: PayloadType) => {
      return apiQuery<PayloadType, ResponseType>(method as any, {
        withCredentials: true,
        url: `${BASE_URL}${url}`,
        payload: payload,
      });
    },
    url,
    method,
  };
};
