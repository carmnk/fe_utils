import { Endpoint } from './endpoint'

export type ExternalApi = {
  external_api_id: string
  name: string
  baseUrl: string
  auth:
    | { type: 'basic'; username: string; password: string }
    | { type: 'bearer'; token: string }
    | { type: 'none' }
  headers: { name: string; value: string; header_id?: string }[] // -> subtable
  useCookies: boolean
  endpoints: Endpoint[]
}

export type ExternalApiDb = Omit<
  ExternalApi,
  'baseUrl' | 'auth' | 'headers' | 'useCookies' | 'endpoints'
> & {
  base_url: string
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string
  auth_basic_password: string
  auth_bearer_token: string
  use_cookies: boolean
  project_id: string
}
