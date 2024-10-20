import { PropertyType } from '../../editorComponents'
import { Element, Property } from '../../editorRendererController'

export type GetInjectedElementIconParams = {
  element: Element
  schemaProps: any
  icons: any
  isHtmlElement: boolean
  elementProps: Property[]
}

export const getInjectedElementIconProps = (
  params: GetInjectedElementIconParams
) => {
  const { element, schemaProps, icons, isHtmlElement, elementProps } = params
  const getPropByName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.prop_value

  const elementIconKeys = isHtmlElement
    ? []
    : Object.keys(schemaProps)?.filter(
        (key) => schemaProps[key]?.type === PropertyType.icon
      )
  // e.g. {...., icon: mdiPencil, ... }
  const injectedIconsDict = elementIconKeys?.reduce(
    (acc, key) => ({
      ...acc,
      [key]: icons?.[getPropByName(key)],
    }),
    {}
  )
  // icon injections for array elements
  const elementArrayIconKeys = isHtmlElement
    ? []
    : Object.keys(schemaProps)?.filter((key) => {
        const itemsProps = (schemaProps?.[key] as any)?.items?.[0]?.properties
        return (
          schemaProps[key]?.type === PropertyType.Array &&
          Object.keys(itemsProps || {})?.filter?.(
            (key) => itemsProps[key]?.type === PropertyType.icon
          )
        )
      })
  const elementArrayIconInjectionDict = element?._type
    ?.toLowerCase()
    .includes('treeview')
    ? {}
    : elementArrayIconKeys
        .map((key) => {
          const itemsProps = (schemaProps?.[key] as any)?.items?.[0]?.properties
          return Object.keys(itemsProps || {})
            ?.filter((key) => itemsProps[key]?.type === PropertyType.icon)
            ?.map((itemKey) => ({ key, itemKey }))
        })
        .flat()
        ?.reduce((acc, it) => {
          return {
            ...acc,
            [it.key]: getPropByName(it.key)?.map?.((item: any) => ({
              ...item,
              [it.itemKey]: icons?.[item[it.itemKey]],
            })),
          }
        }, {})

  return {
    ...injectedIconsDict,
    ...elementArrayIconInjectionDict,
  }
}
