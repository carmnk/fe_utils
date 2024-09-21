export type Endpoint = {
  endpoint_id: string
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  responseType: 'json' | 'text' | 'blob'
  useCookies: boolean
  headers: { name: string; value: string; header_id?: string }[] // -> subtable
  params: { key: string; value: string; param_id?: string }[] // -> subtable
  body: { key: string; value: any; body_param_id?: string }[] // -> subtable
  auth:
    | { type: 'basic'; username: string; password: string }
    | { type: 'bearer'; token: string }
    | { type: 'none' }
}

export type EndpointDb = Omit<
  Endpoint,
  'headers' | 'params' | 'body' | 'auth' | 'useCookies' | 'responseType'
> & {
  response_type: 'json' | 'text' | 'blob' //XXX
  use_cookies: boolean //XXX
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string | null
  auth_basic_password: string | null
  auth_bearer_token: string | null
  api_id: string
  project_id: string
}
