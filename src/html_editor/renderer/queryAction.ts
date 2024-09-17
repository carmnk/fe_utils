import { query } from '../../api/utils/httpQuerys'
import { EditorControllerAppStateReturnType } from '../editorRendererController/editorRendererControllerTypes'

const replacePlaceholders = (
  text: string,
  placeholders: { [key: string]: string }
) => {
  let result = text
  for (const key in placeholders) {
    result = result.replaceAll('{' + key + '}', placeholders[key])
  }
  return result
}

export const queryAction = async (
  appController: EditorControllerAppStateReturnType,
  actionId: string,
  method: any,
  url: string,
  useCookies: boolean,
  payload: any,
  headers?: any,
  params?: any,
  responseType?: any,
  basicAuth?: { username: string; password: string },
  placeholders: { [key: string]: string } = {}
) => {
  const adjMethod = replacePlaceholders(method, placeholders)

  const adjParams = {
    url: replacePlaceholders(url, placeholders),
    payload: Object.keys(payload ?? {}).reduce((acc, key) => {
      return { ...acc, [key]: replacePlaceholders(payload[key], placeholders) }
    }, {}),
    withCredentials: useCookies,
    auth: basicAuth,
    headers: Object.keys(headers ?? {}).reduce((acc, key) => {
      return { ...acc, [key]: replacePlaceholders(payload[key], placeholders) }
    }, {}),
    params: Object.keys(params ?? {}).reduce((acc, key) => {
      return { ...acc, [key]: replacePlaceholders(payload[key], placeholders) }
    }, {}),
    responseType: replacePlaceholders(responseType, placeholders) as any,
  }

  // IMPLEMENTATION -> replace all relevantProps with placeholders if any
  // -> url, payload per key, headers per key, params per key, responseType, method,

  const response = await query(adjMethod as any, adjParams)
  console.log('query triggered', adjParams, placeholders, 'response', response)

  const responseRaw = response?.data as any
  const responseAdj = responseRaw?.success ? responseRaw.data : responseRaw
  if (response?.data) {
    appController.actions.updateData(actionId, responseAdj)
  }

  return response
}
