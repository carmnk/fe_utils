import { ExternalApi } from '../../../types'
import { ExternalApiDb } from '../../../types/externalApi'
import { v4 as uuid } from 'uuid'
import { EditorStateDbDataType } from '../editorDbStateType'
import { EndpointDb } from '../../../types/endpoint'

export const serializeExternalApis = (
  externalApisIn: ExternalApi[],
  project_id: string
): Pick<
  EditorStateDbDataType,
  'externalApis' | 'endpoints' | 'bodyParams' | 'params' | 'headers'
> => {
  const externalApis: ExternalApiDb[] = externalApisIn.map((api) => {
    return {
      external_api_id: api.external_api_id,
      name: api.name,
      project_id,
      base_url: api.base_url,
      auth_type: api.auth.type,
      auth_basic_username: api.auth.type === 'basic' ? api.auth.username : null,
      auth_basic_password: api.auth.type === 'basic' ? api.auth.password : null,
      auth_bearer_token: api.auth.type === 'bearer' ? api.auth.token : null,
      use_cookies: api.use_cookies,
    }
  })
  const endpoints: EndpointDb[] = externalApisIn
    .map((api) => {
      return api.endpoints.map((endpoint) => {
        return {
          endpoint_id: endpoint.endpoint_id,
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          response_type: endpoint.response_type,
          use_cookies: endpoint.use_cookies,
          auth_type: endpoint?.auth?.type,
          auth_basic_username:
            endpoint?.auth?.type === 'basic' ? endpoint?.auth?.username : null,
          auth_basic_password:
            endpoint?.auth?.type === 'basic' ? endpoint?.auth?.password : null,
          auth_bearer_token:
            endpoint?.auth?.type === 'bearer' ? endpoint.auth.token : null,
          api_id: api.external_api_id,
          project_id,
        }
      })
    })
    .flat()

  const headers = externalApisIn
    .map((api) => {
      const apiHeaders = api?.headers?.map?.((header) => {
        const newHeaderId = uuid()
        return {
          ...header,
          project_id,
          header_id: header?.header_id ?? newHeaderId,
          key: header.key,
          value: header.value,
          api_id: api.external_api_id,
          endpoint_id: null,
        }
      })
      const endpointHeaders = api?.endpoints
        ?.map(
          (ep) =>
            ep?.headers?.map?.((header) => {
              const newHeaderId = uuid()
              return {
                ...header,
                project_id,
                header_id: header?.header_id ?? newHeaderId,
                key: header.key,
                value: header.value,
                api_id: api.external_api_id,
                endpoint_id: ep.endpoint_id,
              }
            }) || []
        )
        .flat()
      return [...(apiHeaders ?? []), ...(endpointHeaders ?? [])]
    })
    .flat()

  const params = externalApisIn
    .map((api) =>
      api.endpoints
        .map((ep) =>
          ep.params.map((param) => {
            return {
              param_id: param?.param_id ?? uuid(),
              key: param.key,
              value: param.value,
              endpoint_id: ep.endpoint_id,
              project_id,
            }
          })
        )
        .flat()
    )
    .flat()

  const bodyParams = externalApisIn
    .map((api) =>
      api.endpoints
        .map(
          (ep) =>
            ep.body?.map?.((param) => {
              return {
                body_param_id: param?.body_param_id ?? uuid(),
                key: param.key,
                value: param.value,
                endpoint_id: ep.endpoint_id,
                project_id,
              }
            }) || []
        )
        .flat()
    )
    .flat()
  return {
    externalApis,
    endpoints,
    headers,
    params,
    bodyParams,
  }
}
