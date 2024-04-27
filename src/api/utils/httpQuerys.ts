import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

/** Definitions and Types  */

/** HTTP Query method + 2 custom Response types with File (blob) */
export enum QUERY_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  GET_FILE = 'GET_FILE', // GET with responseType: 'blob'
  POST_GET_FILE = 'POST_GET_FILE', // POST with responseType: 'blob'
}

enum QUERY_TIMEOUT {
  POST = 1000 * 60 * 2,
  POST_GET_FILE = 1000 * 60 * 5,
  GET = 1000 * 60 * 2,
  GET_FILE = 1000 * 60 * 5,
  PUT = 1000 * 60 * 2,
  DELETE = 1000 * 60 * 2,
}

/** Unknown Query Payload */
export type UnknownQueryPayloadType = Record<string, unknown>

/** AxiosConfig with some minor adjustments */
export type QueryConfigType = Omit<
  AxiosRequestConfig,
  'data' | 'url' | 'method'
> & {
  disableRedirectToLogin?: boolean
}

export type QueryParamType<PayloadType> = QueryConfigType & {
  url: string
  payload?: PayloadType
}

/** The type of the query functions */
export type QueryFnType<
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
> = (
  params: QueryParamType<PayloadType>
) => Promise<AxiosResponse<ResponseType>>

/** utility fns */

const getContentHeader = (payload: unknown) => {
  const contentType =
    payload && payload instanceof FormData
      ? 'multipart/form-data'
      : 'application/json'
  const contentHeader = { 'Content-Type': contentType }
  return contentHeader
}
const getHeaders = (
  payload: unknown,
  queryHeaders?: AxiosRequestConfig['headers']
) => {
  return {
    ...getContentHeader(payload),
    ...(queryHeaders ?? {}),
  }
}

const makeAxiosQueryConfig = <PayloadType>(
  method: QUERY_METHOD,
  params: QueryParamType<PayloadType>
) => {
  // const
  const { url, headers: queryHeaders, payload, ...queryConfig } = params
  const headers: AxiosRequestConfig['headers'] = getHeaders(
    payload,
    queryHeaders
  )
  const responseTypeInjection =
    method === QUERY_METHOD.GET_FILE || method === QUERY_METHOD.POST_GET_FILE
      ? { responseType: 'blob' as const }
      : {}

  const methodLower = method.toLowerCase()
  const methodAdj = methodLower.includes('post')
    ? 'post'
    : methodLower.includes('get')
      ? 'get'
      : methodLower.includes('put')
        ? 'put'
        : methodLower.includes('delete')
          ? 'delete'
          : 'get'

  const axiosQueryConfig: AxiosRequestConfig = {
    ...queryConfig,
    method: methodAdj,
    url,
    timeout: QUERY_TIMEOUT[method],
    data: payload,
    headers,
    ...responseTypeInjection,
  }
  return axiosQueryConfig
}

/** POST QUERY (with axios, preconfigured) */
export const post = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
>(
  params: QueryParamType<PayloadType>
): ReturnType<QueryFnType<PayloadType, ResponseType>> => {
  const axiosQueryConfig = makeAxiosQueryConfig(QUERY_METHOD.POST, params)
  return axios(axiosQueryConfig)
}

export const postWithReturnedFile = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
>(
  params: QueryParamType<PayloadType>
): ReturnType<QueryFnType<PayloadType, ResponseType>> => {
  const axiosQueryConfig = makeAxiosQueryConfig(
    QUERY_METHOD.POST_GET_FILE,
    params
  )
  return axios(axiosQueryConfig)
}

export const get = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
>(
  params: QueryParamType<PayloadType>
): ReturnType<QueryFnType<PayloadType, ResponseType>> => {
  const axiosQueryConfig = makeAxiosQueryConfig(QUERY_METHOD.GET, params)
  return axios(axiosQueryConfig)
}

export const getFile = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
>(
  params: QueryParamType<PayloadType>
): ReturnType<QueryFnType<PayloadType, ResponseType>> => {
  const axiosQueryConfig = makeAxiosQueryConfig(QUERY_METHOD.GET_FILE, params)
  return axios(axiosQueryConfig)
}

export const put = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
>(
  params: QueryParamType<PayloadType>
): ReturnType<QueryFnType<PayloadType, ResponseType>> => {
  const axiosQueryConfig = makeAxiosQueryConfig(QUERY_METHOD.PUT, params)
  return axios(axiosQueryConfig)
}

export const deletion = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
>(
  params: QueryParamType<PayloadType>
): ReturnType<QueryFnType<PayloadType, ResponseType>> => {
  // const { disableRedirectToLogin } = params;
  const axiosQueryConfig = makeAxiosQueryConfig(QUERY_METHOD.DELETE, params)
  return axios(axiosQueryConfig)
}

export type QueryResponseType<ResponseType = unknown> = {
  data: ResponseType | null
  status: number | string
  statusText: string
  headers: Record<string, string>
  error?: unknown
}

/** the query that unites them all */
export const query = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown,
>(
  method: QUERY_METHOD,
  params: QueryParamType<PayloadType>
): Promise<QueryResponseType<ResponseType>> => {
  const queryFn =
    method === 'POST'
      ? post
      : method === 'PUT'
        ? put
        : method === 'DELETE'
          ? deletion
          : method === 'GET_FILE'
            ? getFile
            : method === 'POST_GET_FILE'
              ? postWithReturnedFile
              : get
  try {
    const res = await queryFn<PayloadType, ResponseType>(params)
    const response = {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res?.headers as Record<string, string>,
    }
    return response
  } catch (e) {
    const error: AxiosError = e as AxiosError
    const axiosResponse: AxiosError['response'] | null =
      (axios.isAxiosError(e) ? error?.response : error?.response) ??
      null
    const altErrorCode =
      (typeof e === 'object' && !!e && 'code' in e && (e?.code as string)) ||
      null
    const altMessage =
      (typeof e === 'object' &&
        !!e &&
        'message' in e &&
        (e?.message as string)) ||
      null
    const response = {
      data: (e as any)?.response?.data ?? null,
      error: e,
      status: axiosResponse?.status ?? altErrorCode ?? 'unknown',
      statusText: axiosResponse?.statusText ?? altMessage ?? 'unknown',
      headers: (axiosResponse?.headers as Record<string, string>) ?? {},
    }
    return response
  }
}
