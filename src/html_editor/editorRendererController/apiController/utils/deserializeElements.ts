import { Element } from '../../index'
import { ComponentDefType } from '../../../editorComponents/index'
import { ElementDb } from '../../../types/element'
import { isComponentType } from '../../../utils'

export const deserializeElements = (
  elementsIn: ElementDb[],
  COMPONENT_MODELS: ComponentDefType[]
): {
  elements: Element[]
  alternativeViewports: {
    sm: Element[]
    md: Element[]
    lg: Element[]
    xl: Element[]
  }
} => {
  const allElements: ElementDb[] =
    elementsIn?.map?.((el) => ({
      ...(isComponentType(el.element_type)
        ? COMPONENT_MODELS.find((bc) => bc.type === el.element_type)
        : {}),
      element_id: el.element_id,
      element_html_id: el.element_html_id,
      parent_id: el.parent_id,
      content: el.content as string,
      element_type: el.element_type as string,
      // _disableDelete: el.element_disable_delete ?? undefined,
      element_page: el.element_page as string,
      viewport: el.viewport,
      template_id: el.template_id,
      project_id: el.project_id,
      component_id: el.component_id,
      ref_component_id: el.ref_component_id,
    })) ?? []
  const baseViewportElements = allElements.filter((el) => !el?.viewport)

  const elements = [...baseViewportElements]
  const alternativeElements = allElements.filter((el) => el?.viewport)
  const alternativeViewports = {
    sm: alternativeElements.filter((el) => el?.viewport === 'sm'),
    md: alternativeElements.filter((el) => el?.viewport === 'md'),
    lg: alternativeElements.filter((el) => el?.viewport === 'lg'),
    xl: alternativeElements.filter((el) => el?.viewport === 'xl'),
  }
  return { elements, alternativeViewports }
}
