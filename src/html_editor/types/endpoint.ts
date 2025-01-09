import { BodyParam } from './bodyParam'
import { Header } from './Header'
import { Param } from './param'

export type Endpoint = {
  endpoint_id: string
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  response_type: 'json' | 'text' | 'blob'
  use_cookies: boolean
  headers: Header[] // -> subtable
  params: Param[] // -> subtable
  body: BodyParam[] // -> subtable
  auth:
    | { type: 'basic'; username: string; password: string }
    | { type: 'bearer'; token: string }
    | { type: 'none' }
}

export type EndpointDb = Omit<
  Endpoint,
  'headers' | 'params' | 'body' | 'auth'
> & {
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string | null
  auth_basic_password: string | null
  auth_bearer_token: string | null

  api_id: string
  project_id: string
}
