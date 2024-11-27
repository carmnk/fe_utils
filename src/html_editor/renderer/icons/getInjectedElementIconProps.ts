import {
  ArraySchemaType,
  ExtendedObjectSchemaType,
  PropertyType,
} from '../../editorComponents'
import { Element, Property } from '../../editorRendererController'

export type GetInjectedElementIconParams = {
  element: Element
  schemaProps: ExtendedObjectSchemaType['properties']
  icons?: Record<string, string>
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
      [key]: icons?.[getPropByName(key) as string],
    }),
    {}
  )
  // icon injections for array elements
  const elementArrayIconKeys = isHtmlElement
    ? []
    : Object.keys(schemaProps)?.filter((key) => {
        const propertySchema = schemaProps[key] as ArraySchemaType
        const itemsProps =
          'items' in propertySchema &&
          propertySchema.items?.length &&
          'properties' in propertySchema.items[0]
            ? propertySchema.items[0]?.properties
            : {}
        return (
          propertySchema?.type === PropertyType.Array &&
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
          const propertySchema = schemaProps[key] as ArraySchemaType
          const itemsProps =
            ('items' in propertySchema &&
              propertySchema.items?.length &&
              'properties' in propertySchema.items[0] &&
              propertySchema?.items?.[0]?.properties) ||
            {}
          return Object.keys(itemsProps || {})
            ?.filter((key) => itemsProps[key]?.type === PropertyType.icon)
            ?.map((itemKey) => ({ key, itemKey }))
        })
        .flat()
        ?.reduce((acc, it) => {
          const propValue = getPropByName(it.key)
          return {
            ...acc,
            [it.key]: Array.isArray(propValue)
              ? propValue?.map?.((item) => ({
                  ...item,
                  [it.itemKey]: icons?.[item[it.itemKey]],
                }))
              : [],
          }
        }, {})

  return {
    ...injectedIconsDict,
    ...elementArrayIconInjectionDict,
  }
}
