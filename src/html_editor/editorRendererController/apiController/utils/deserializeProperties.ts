import { ComponentDefType, PropertyType } from '../../../editorComponents/index'
import { checkForPlaceholders } from '../../../renderer/index'
import { Element, Property } from '../../../types/index'
import { isComponentType } from '../../../utils'

export const deserializeProperties = (
  properties: Property[],
  elements: Element[],
  COMPONENT_MODELS: ComponentDefType[]
) => {
  return (
    properties?.map((prop) => {
      const element = elements.find((el) => el.element_id === prop.element_id)
      const baseComponent = COMPONENT_MODELS.find(
        (comp) => comp.type === element?.element_type
      )
      const baseComponentSchema = baseComponent?.schema
      const baseComponentSchemaProps = baseComponentSchema?.properties
      const baseComponentSchemaProp = baseComponentSchemaProps?.[prop.prop_name]
      const baseComponentSchemaPropType =
        baseComponentSchemaProp?.type as PropertyType
      const isSchemaPropInt = baseComponentSchemaPropType === PropertyType.Int
      const isSchemaPropNumeric =
        isSchemaPropInt || baseComponentSchemaPropType === PropertyType.Number

      const isSchemaPropJson = baseComponentSchemaPropType === PropertyType.json
      const isSchemaPropEventHandler =
        baseComponentSchemaPropType === PropertyType.eventHandler

      const isHtmlEvent =
        prop.prop_name?.startsWith('on') &&
        !isComponentType(element?.element_type ?? '')

      const value =
        isHtmlEvent ||
        isSchemaPropJson ||
        isSchemaPropEventHandler ||
        [
          'items',
          'slotProps',
          'columns',
          'fields',
          'filters',
          'buttonProps',

          // 'sx',
          // 'data',
          'footerData',
          // 'fields',
          // 'onClick',
        ].includes(prop.prop_name) ||
        (['children'].includes(prop.prop_name) &&
          element?.element_type !== 'Typography')
          ? (() => {
              try {
                const propValue = prop.prop_value
                // check if propValue is a placeholder
                if (typeof propValue === 'string') {
                  const matches = checkForPlaceholders(propValue)
                  if (matches) {
                    return propValue
                  }
                  return JSON.parse(propValue)
                }
                return propValue
              } catch (e) {
                // console.error(e, prop)
                return prop.prop_value
              }
            })()
          : prop.prop_value === 'null'
            ? null
            : prop.prop_value === 'true'
              ? true
              : prop.prop_value === 'false'
                ? false
                : isSchemaPropInt
                  ? parseInt(prop?.prop_value as string)
                  : isSchemaPropNumeric
                    ? parseFloat(prop?.prop_value as string)
                    : prop.prop_value
      return { ...prop, prop_value: value }
    }) ?? []
  )
}
