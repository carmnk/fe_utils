import { ExternalApi } from '../../../types'
import { Header } from '../../../types/Header'
import { BodyParam } from '../../../types/bodyParam'
import { EndpointDb } from '../../../types/endpoint'
import { ExternalApiDb } from '../../../types/externalApi'
import { Param } from '../../../types/param'

export const deserializeServerExternalApis = (
  externalApisIn: ExternalApiDb[],
  endpoints: EndpointDb[],
  headers: Header[],
  params: Param[],
  bodyParams: BodyParam[]
) => {
  const externalApis: ExternalApi[] =
    externalApisIn?.map((api) => {
      return {
        external_api_id: api.external_api_id,
        name: api.name,
        auth:
          api.auth_type === 'basic' &&
          api.auth_basic_username &&
          api.auth_basic_password
            ? {
                type: api.auth_type,
                username: api.auth_basic_username,
                password: api.auth_basic_password,
              }
            : api.auth_type === 'bearer' && api.auth_bearer_token
              ? { type: api.auth_type, token: api.auth_bearer_token }
              : { type: 'none' },
        base_url: api.base_url,
        use_cookies: api.use_cookies,
        project_id: api.project_id,
        endpoints: endpoints
          .filter((ep) => ep.api_id === api.external_api_id)
          ?.map((ep) => {
            return {
              project_id: ep.project_id,
              endpoint_id: ep.endpoint_id,
              name: ep.name,
              url: ep.url,
              method: ep.method,
              auth:
                ep.auth_type === 'basic'
                  ? {
                      type: ep.auth_type,
                      username: ep.auth_basic_username as string,
                      password: ep.auth_basic_password as string,
                    }
                  : ep.auth_type === 'bearer'
                    ? {
                        type: ep.auth_type,
                        token: ep.auth_bearer_token as string,
                      }
                    : { type: ep.auth_type },
                    response_type: ep.response_type,
              use_cookies: ep.use_cookies,
              headers: headers
                ?.filter(
                  (header) =>
                    header.endpoint_id === ep.endpoint_id && header.endpoint_id
                )
                ?.map((header) => ({
                  ...header,
                  name: header.key,
                })),
              params: params.filter(
                (param) => param.endpoint_id === ep.endpoint_id
              ),
              body: bodyParams.filter(
                (param) => param.endpoint_id === ep.endpoint_id
              ),
            }
          }),
        headers: headers
          .filter(
            (header) =>
              header.api_id &&
              header.api_id === api.external_api_id &&
              !header.endpoint_id
          )
          ?.map((header) => ({
            ...header,
            name: header.key,
          })),
      }
    }) ?? []
  return externalApis
}
