import { makeAppSpecificApiQueryGenerator } from './utils/makeApiQuery'

const BASE_URL = 'http://localhost:3000'

export const makeApi = makeAppSpecificApiQueryGenerator(BASE_URL, {
  withCredentials: true,
})
