export const getAmountJsonChildren = (
  json: unknown,
  path: (string | number)[],
  collapsedPaths: string[]
): number => {
  if (collapsedPaths.includes(path.join('.'))) {
    return 2
  }

  if (Array.isArray(json)) {
    return (
      json
        .map((item, iIdx) =>
          getAmountJsonChildren(item, [...path, iIdx], collapsedPaths)
        )
        ?.reduce((acc, item) => {
          return acc + item
        }, 0) + 2
    )
  }
  if (json && typeof json === 'object') {
    return (
      Object.keys(json)
        .map((key) => {
          return getAmountJsonChildren(
            json[key as keyof typeof json],
            [...path, key],
            collapsedPaths
          )
        })
        ?.reduce((acc, item) => {
          return acc + item
        }, 0) + 2 // opening and closing brackets are in 1 row
    )
  } else {
    return 1
  }
}
