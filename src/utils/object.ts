import { isObject, transform, isEqual } from 'lodash'

export function getDeepDifference(
  object: Record<string, unknown>,
  base: Record<string, unknown>
) {
  function changes(
    object: Record<string, unknown>,
    base: Record<string, unknown>
  ) {
    return transform(
      object,
      function (result: Record<string, unknown>, value, key) {
        const baseValue = base[key as string]
        if (!isEqual(value, baseValue)) {
          result[key] =
            isObject(value) && isObject(base[key as string])
              ? changes(
                  value as Record<string, unknown>,
                  base[key as string] as Record<string, unknown>
                )
              : value
        }
      }
    )
  }
  return changes(object, base)
}

export const getDeepPropertyByPath = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  path: string[]
): unknown => path.reduce((acc, part) => acc && acc[part], obj)
