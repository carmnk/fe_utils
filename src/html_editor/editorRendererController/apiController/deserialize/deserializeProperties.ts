import { ElementModel, PropertyType } from '../../../editorComponents/index'
import { checkForPlaceholders } from '../../../renderer/index'
import { checkForParsableJson } from '../../../renderer/placeholder/replacePlaceholder'
import { Element, Property, Template } from '../../../types/index'
import { isComponentType } from '../../../utils/utils'

export const deserializeProperties = (
  properties: Property[],
  elements: Element[],
  ELEMENT_MODELS: ElementModel[],
  templates: Template[]
) => {
  return (
    properties?.map((prop) => {
      const element = elements.find((el) => el.element_id === prop.element_id)
      const template = templates.find(
        (temp) => temp.template_id === prop?.template_id
      )
      const elementType = element?.element_type ?? template?.element_type
      const baseComponent = ELEMENT_MODELS.find(
        (comp) => comp.type === elementType
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
        prop.prop_name?.startsWith('on') && !isComponentType(elementType ?? '')

      // console.log(
      //   'properties',
      //   elementType,
      //   element,
      //   template,
      //   prop,
      //   isHtmlEvent,
      //   isSchemaPropJson,
      //   isSchemaPropEventHandler,
      //   isSchemaPropInt,
      //   isSchemaPropNumeric
      // )
      const value =
        isHtmlEvent ||
        isSchemaPropJson ||
        isSchemaPropEventHandler ||
        [
          'items', // array
          'slotProps', // object
          'columns', // array?
          'fields', // array?
          'filters', // array?
          'buttonProps', // object
          'footerData', //json
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
                  console.debug(
                    'propValue before JSON.parse',
                    propValue,
                    matches
                  )
                  if (!checkForParsableJson(propValue)) {
                    return propValue
                  }

                  return JSON.parse(propValue)
                }

                return propValue
              } catch (e) {
                console.error(e, prop)
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
