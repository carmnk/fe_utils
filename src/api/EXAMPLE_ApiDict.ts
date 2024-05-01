import { MatchingObjectKeys } from '../utils/types'
import { makeApi } from './EXAMPLE_makeAppApiQuery'

/** API DICT
 * @types query endpoints can be fully typed by using the generator fn returned by makeAppSpecificApiQueryGenerator
 * @example implementation
 * API.login = makeApi<{username: string, password: string},{success: true}>('/_api/_auth/login', 'POST')
 * usage:
 * const response = await API.login().query({username: 'test', password: 'test'})
 */
export const API_DICT_EXAMPLE = {
  login: () =>
    makeApi<{ log: string }, { success: true }>('/auth/code', 'POST'),
  // alibaba: '40 thiefs',
}

// Check types of dict indirectly since it's type is inferred
type API_DICT = typeof API_DICT_EXAMPLE
type API_DICT_KEYS = keyof API_DICT
// eslint-disable-next-line @typescript-eslint/ban-types
type API_DICT_FN_KEYS = MatchingObjectKeys<API_DICT, Function>
type API_DICT_OBJ_KEYS = Exclude<API_DICT_KEYS, API_DICT_FN_KEYS>
type API_FUNCTION_DEF = ReturnType<API_DICT[API_DICT_FN_KEYS]>
type API_OBJECT_DEF = API_DICT[API_DICT_OBJ_KEYS]
type API_DEF = API_FUNCTION_DEF | API_OBJECT_DEF
type API_DEF_QUERY = API_DEF['query']
type API_DEF_QUERY_PARAMS = Parameters<API_DEF_QUERY>
type API_DEF_QUERY_PARAMS_0 = API_DEF_QUERY_PARAMS[0]
type API_DEF_QUERY_PARAMS_1 = API_DEF_QUERY_PARAMS[1]
type API_DEF_URL = API_DEF['url']
type API_DEF_METHOD = API_DEF['method']
