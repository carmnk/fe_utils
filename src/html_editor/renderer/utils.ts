export const isStringLowerCase = (str: string): boolean => {
  return str === str.toLowerCase()
}

export const isComponentType = (type: string): boolean =>
  !isStringLowerCase(type.slice(0, 1))
