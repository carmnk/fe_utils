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
