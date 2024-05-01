import {
  QUERY_METHOD,
  QueryParamType,
  QueryResponseType,
  query,
} from './httpQuerys'
type QUERY_METHOD_STRING = `${QUERY_METHOD}`

export type MakeAppSpecificApi = <PayloadType = undefined, ResponseType = any>(
  url: string,
  method: QUERY_METHOD_STRING
) => {
  query: (
    payload?: PayloadType,
    overrideQueryParams?: QueryParamType<unknown>
  ) => Promise<QueryResponseType<ResponseType>>
  url: string
  method: QUERY_METHOD_STRING
}

/** will create a function that can be used to fill an Typed API dict using url and method (adjusted by responseType) only
 * @param baseUrl provide the baseUrl so it doesnt have to be added with each endpoint in the dict
 * @param params customize the Axios Api Query globally e.g. by setting withCredentials=true (the specific query can still override)
 * @param onResponse Will be triggered on ALL querys anc can be used to perform action (like remove login data from localstorage on 401 response)
 * @returns a function with the parameters: url and method
 * @example
 * const makeApi = makeAppSpecificApiQueryGenerator(BASE_URL, {withCredentials: true}) // generate the creator function
 * const API = { login: () => makeApi<PayloadType=undefined,ResponseType=any>('/_api/_auth/login', 'POST')} // use the creator function to fill the API dict
 * const response = await API.login().query({username: 'test', password: 'test'}) // use the API endpoint
 */
export const makeAppSpecificApiQueryGenerator = (
  baseUrl: string,
  params: Partial<QueryParamType<unknown>>,
  onResponse?: (response: QueryResponseType<unknown>) => any
): MakeAppSpecificApi => {
  return <PayloadType = undefined, ResponseType = any>(
    url: string,
    method: QUERY_METHOD_STRING
  ) => ({
    query: async (
      payload?: PayloadType,
      overrideQueryParams?: QueryParamType<unknown>
    ) => {
      const response = await query<PayloadType, ResponseType>(method as any, {
        ...params,
        ...overrideQueryParams,
        payload,
        url: `${baseUrl}${url}`,
      })
      const resOnResponse = onResponse?.(response)
      return response
    },
    url,
    method,
  })
}
