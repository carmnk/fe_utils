import { query } from '../../api/utils/httpQuerys'
import { AppController } from '../editorRendererController/types'
import { BodyParam } from '../editorRendererController/types/bodyParam'
import { Header } from '../editorRendererController/types/Header'
import { Param } from '../editorRendererController/types/param'

const replacePlaceholders = (
  text: string,
  placeholders: { [key: string]: string },
  debug: any = false
) => {
  if (!['string', 'number'].includes(typeof text) || !placeholders) {
    console.debug('replacePlaceholders out1', text, placeholders)
    return text
  }
  let result = text
  for (const key in placeholders) {
    if (!result.includes('{' + key + '}')) {
      continue
    }
    result = result?.replaceAll?.('{' + key + '}', placeholders[key])
    const regexOnlyNumbersOrDecimal = /^[0-9]+(\.[0-9]+)?$/
    const isNumberOrDecimal = regexOnlyNumbersOrDecimal.test(placeholders[key])
    if (isNumberOrDecimal && result !== text) {
      console.debug('isNumberOrDecimal', placeholders[key])
      result = placeholders[key]
      // currently a number placeholder can only be replaced alone
      break
    }
    if (debug) {
      console.debug(
        'replacePlaceholders' + debug,
        key,
        placeholders[key],
        result
      )
    }
  }
  if (debug) {
    console.debug('replacePlaceholders out' + debug, result, placeholders)
  }
  return result
}

export const queryAction = async (
  appController: AppController,
  actionId: string,
  method: any,
  url: string,
  useCookies: boolean,
  payload: BodyParam[] = [],
  headers: Header[] = [],
  params: Param[] = [],
  responseType?: any,
  basicAuth?: { username: string; password: string },
  placeholders: { [key: string]: string } = {}
) => {
  const adjMethod = replacePlaceholders(method, placeholders)

  const adjParams = {
    url: replacePlaceholders(url, placeholders),
    payload:
      payload?.reduce((acc, param) => {
        return {
          ...acc,
          [param.key]: replacePlaceholders(param.value, placeholders, true),
        }
      }, {}) ?? {},

    // Object.keys(payload ?? {}).reduce((acc, key) => {
    //   return { ...acc, [key]: replacePlaceholders(payload[key], placeholders) }
    // }, {}),
    withCredentials: useCookies,
    auth: basicAuth,
    headers:
      headers?.reduce((acc, header) => {
        return {
          ...acc,
          [header.key]: replacePlaceholders(header.value, placeholders),
        }
      }, {}) ?? {},
    params:
      params?.reduce((acc, param) => {
        return {
          ...acc,
          [param.key]: replacePlaceholders(param.value, placeholders),
        }
      }, {}) ?? {},

    // Object.keys(headers ?? {}).reduce((acc, key) => {
    //   return { ...acc, [key]: replacePlaceholders(headers[key], placeholders) }
    // }, {}),
    // params: Object.keys(params ?? {}).reduce((acc, key) => {
    //   return { ...acc, [key]: replacePlaceholders(params[key], placeholders) }
    // }, {}),
    responseType: replacePlaceholders(responseType, placeholders) as any,
  }

  // IMPLEMENTATION -> replace all relevantProps with placeholders if any
  // -> url, payload per key, headers per key, params per key, responseType, method,

  console.log(
    'queryAction inner ',
    adjMethod,
    adjParams,
    'payload',
    payload,
    payload?.reduce((acc, param) => {
      return {
        ...acc,
        [param.key]: param.value,
      }
    }, {}) ?? {},
    payload?.reduce((acc, param) => {
      return {
        ...acc,
        [param.key]: replacePlaceholders(
          param.value,
          placeholders,
          'innerQueryAction'
        ),
      }
    }, {}) ?? {},
    'PL END',
    placeholders,
    method,
    url
  )
  const response = await query(adjMethod as any, adjParams)

  const responseRaw = response?.data as any
  // const responseAdj = responseRaw?.success ? responseRaw.data : responseRaw
  if (response?.data) {
    appController.actions.updateData(actionId, responseRaw)
  }

  return response
}
