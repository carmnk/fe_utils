import { Element, Template } from '../../../types'
import { Property } from '../../../types/property'

export const serializeProperties = (
  properties: Property[],
  elements: Element[],
  templates: Template[]
) => {
  // problem: only delete props with prop_value = null or undefined
  // ONLY IF no template with that elementType exists which has the same prop_name
  // OTHERWISE IF NOT -> remove

  return (
    properties
      ?.filter((prop) => {
        const propName = prop?.prop_name
        const elementId = prop?.element_id
        const elementType = elementId
          ? elements.find((el) => el?.element_id === elementId)?.element_type
          : null
        const templateOfElementType = elementType
          ? templates.find((templ) => templ.element_type === elementType)
          : null
        const correspondingTemplateId = templateOfElementType?.template_id
        const correspondingTemplateProp = correspondingTemplateId
          ? properties.find(
              (prop) =>
                prop.prop_name === propName &&
                prop.template_id === correspondingTemplateId
            )
          : null

        return (
          ![undefined, null].includes(prop?.prop_value as null) ||
          correspondingTemplateProp
        )
      })
      ?.map((prop) => {
        const prop_value = ['function', 'object'].includes(
          typeof prop.prop_value
        )
          ? JSON.stringify(prop.prop_value)
          : prop.prop_value === undefined
            ? null
            : prop.prop_value
        return { ...prop, prop_value }
      }) || []
  )
}
