import { Endpoint } from './endpoint'
import { Header } from './Header'

export type ExternalApi = {
  external_api_id: string
  name: string
  base_url: string
  use_cookies: boolean
  auth:
    | { type: 'basic'; username: string; password: string }
    | { type: 'bearer'; token: string }
    | { type: 'none' }
  headers: Header[] // -> subtable
  endpoints: Endpoint[]
}

export type ExternalApiDb = Omit<
  ExternalApi,
  'auth' | 'headers' | 'endpoints'
> & {
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string | null
  auth_basic_password: string | null
  auth_bearer_token: string | null

  project_id: string
}
